// Shared, side-effect-free rules of the place contribution validator.
// The CLI (validate-places.ts) and the API place index both use this module,
// so every catalog/corpus rule lives here exactly once.

type Dict = Record<string, unknown>;
type Place = Dict;
type ValidCoordinates = Dict & { latitude: number; longitude: number };
type Findings = {
  errors: string[];
  warnings: string[];
  error(id: string, field: string, message: string): void;
  warning(id: string, field: string, message: string): void;
};

export type CorpusFragment = {
  /** Place name, without the leading "### ". */
  heading: string;
  /** Lines after the heading, LF-normalized, blank lines removed only at both ends. */
  body: string;
  /** Heading line plus body, LF-normalized, blank lines removed only at both ends. */
  text: string;
  /** 1-based line of the heading in the corpus. */
  startLine: number;
  /** 1-based line of the last non-blank line of the fragment (inclusive). */
  endLine: number;
};

export type ValidationReport = { errors: string[]; warnings: string[] };

const placeKeys = [
  "id",
  "name",
  "category",
  "zone",
  "locationScope",
  "coordinates",
  "openingHours",
  "accessCost",
  "foodService",
  "contact",
];
const openingDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const allowedZones = [
  "historic-center",
  "calzada-sisal",
  "northern-neighborhoods",
  "surroundings",
  "valladolid-unspecified",
];
const geohashAlphabet = "0123456789bcdefghjkmnpqrstuvwxyz";
const expectedGeohashPrecision = 7;

function createFindings(): Findings {
  const errors: string[] = [];
  const warnings: string[] = [];
  return {
    errors,
    warnings,
    error(id, field, message) {
      errors.push(`ERROR ${id} ${field}: ${message}`);
    },
    warning(id, field, message) {
      warnings.push(`AVISO ${id} ${field}: ${message}`);
    },
  };
}

function isRecord(value: unknown): value is Dict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function record(value: unknown): Dict {
  return isRecord(value) ? value : {};
}

function unknownArray(value: unknown): unknown[] | null {
  if (!Array.isArray(value)) return null;
  return value;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isKebabCase(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function validateExactKeys(
  value: unknown,
  expected: string[],
  path: string,
  id: string,
  findings: Findings,
): void {
  if (!isRecord(value)) {
    findings.error(id, path, "se esperaba un objeto.");
    return;
  }
  for (const key of expected) {
    if (!(key in value)) findings.error(id, `${path}.${key}`, "se esperaba esta clave.");
  }
  for (const key of Object.keys(value)) {
    if (!expected.includes(key)) {
      const field = path ? `${path}.${key}` : key;
      findings.error(id, field, "clave desconocida; se esperaba únicamente el conjunto definido.");
    }
  }
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  const isRealDate = !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  const isNotFuture = value <= new Date().toISOString().slice(0, 10);
  return isRealDate && isNotFuture;
}

function validateDate(value: unknown, id: string, path: string, findings: Findings): void {
  if (!isValidDate(value)) {
    findings.error(id, path, "se esperaba una fecha real YYYY-MM-DD no futura.");
  }
}

function makeGeohash(latitude: number, longitude: number, precision: number): string {
  let latitudeMin = -90;
  let latitudeMax = 90;
  let longitudeMin = -180;
  let longitudeMax = 180;
  let isLongitudeBit = true;
  let bits = 0;
  let value = 0;
  let geohash = "";

  while (geohash.length < precision) {
    const midpoint = isLongitudeBit
      ? (longitudeMin + longitudeMax) / 2
      : (latitudeMin + latitudeMax) / 2;
    const coordinate = isLongitudeBit ? longitude : latitude;
    if (coordinate >= midpoint) {
      value = (value << 1) + 1;
      if (isLongitudeBit) longitudeMin = midpoint;
      else latitudeMin = midpoint;
    } else {
      value <<= 1;
      if (isLongitudeBit) longitudeMax = midpoint;
      else latitudeMax = midpoint;
    }
    isLongitudeBit = !isLongitudeBit;
    bits++;
    if (bits === 5) {
      geohash += geohashAlphabet[value];
      bits = 0;
      value = 0;
    }
  }
  return geohash;
}

function distanceKm(latitudeA: number, longitudeA: number, latitudeB: number, longitudeB: number): number {
  const radians = (degrees: number): number => degrees * Math.PI / 180;
  const latitudeDelta = radians(latitudeB - latitudeA);
  const longitudeDelta = radians(longitudeB - longitudeA);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(latitudeA))
    * Math.cos(radians(latitudeB))
    * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Template drafts start with these markers so an untouched draft never passes.
function isTemplatePlaceholder(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("replace-with-");
}

function validateIdentityAndZone(
  place: Dict,
  id: string,
  base: Place[] | undefined,
  findings: Findings,
): void {
  if (!isKebabCase(place.id)) {
    findings.error(id, "id", "se esperaba un identificador kebab-case.");
  }
  if (isTemplatePlaceholder(place.id)) {
    findings.error(id, "id", "conserva el marcador de la plantilla; se esperaba el identificador real del lugar.");
  }
  if (!isNonEmptyString(place.name) || place.name.trim() !== place.name) {
    findings.error(id, "name", "se esperaba un nombre no vacío sin espacios al inicio o final.");
  }
  if (isTemplatePlaceholder(place.name)) {
    findings.error(id, "name", "conserva el marcador de la plantilla; se esperaba el nombre exacto del lugar.");
  }
  if (!isKebabCase(place.category)) {
    findings.error(id, "category", "se esperaba una categoría kebab-case.");
  }
  if (!allowedZones.includes(String(place.zone))) {
    findings.error(id, "zone", `se esperaba uno de: ${allowedZones.join(", ")}.`);
  }
  if (place.locationScope !== "city" && place.locationScope !== "surroundings") {
    findings.error(id, "locationScope", "se esperaba city o surroundings.");
  }
  if (typeof place.zone === "string" && typeof place.locationScope === "string") {
    const zoneIsSurroundings = place.zone === "surroundings";
    const scopeIsSurroundings = place.locationScope === "surroundings";
    if (zoneIsSurroundings !== scopeIsSurroundings) {
      findings.error(id, "locationScope", "se esperaba surroundings exactamente cuando zone es surroundings.");
    }
  }
  if (base && isKebabCase(place.category)) {
    const categoryIsKnown = base.some((item) => item.category === place.category);
    if (!categoryIsKnown) {
      findings.warning(id, "category", "valor nuevo respecto al catálogo base; se acepta, confirma que sea intencional.");
    }
  }
}

function validateCoordinates(
  value: unknown,
  id: string,
  base: Place[] | undefined,
  findings: Findings,
): void {
  if (value === null) return;
  validateExactKeys(value, ["status", "latitude", "longitude", "source", "observedOn", "geohash"], "coordinates", id, findings);
  const coordinates = record(value);
  if (coordinates.status !== "confirmed") {
    findings.error(id, "coordinates.status", "se esperaba confirmed.");
  }
  const latitudeIsValid = typeof coordinates.latitude === "number"
    && Number.isFinite(coordinates.latitude)
    && coordinates.latitude >= -90
    && coordinates.latitude <= 90;
  const longitudeIsValid = typeof coordinates.longitude === "number"
    && Number.isFinite(coordinates.longitude)
    && coordinates.longitude >= -180
    && coordinates.longitude <= 180;
  if (!latitudeIsValid) {
    findings.error(id, "coordinates.latitude", "se esperaba un número entre -90 y 90.");
  }
  if (!longitudeIsValid) {
    findings.error(id, "coordinates.longitude", "se esperaba un número entre -180 y 180.");
  }
  if (!isNonEmptyString(coordinates.source)) {
    findings.error(id, "coordinates.source", "se esperaba una fuente no vacía.");
  }
  validateDate(coordinates.observedOn, id, "coordinates.observedOn", findings);
  if (isValidCoordinatePair(coordinates)) {
    validateGeohash(coordinates.geohash, coordinates.latitude, coordinates.longitude, id, findings);
    validateDistanceFromValladolid(coordinates.latitude, coordinates.longitude, id, findings);
    if (base) validateNearDuplicate(coordinates.latitude, coordinates.longitude, base, id, findings);
  } else if (!isValidGeohash(coordinates.geohash)) {
    findings.error(id, "coordinates.geohash", "se esperaba geohash base32 con precisión 7.");
  }
}

function isValidCoordinatePair(value: Dict): value is ValidCoordinates {
  return typeof value.latitude === "number"
    && Number.isFinite(value.latitude)
    && value.latitude >= -90
    && value.latitude <= 90
    && typeof value.longitude === "number"
    && Number.isFinite(value.longitude)
    && value.longitude >= -180
    && value.longitude <= 180;
}

function isValidGeohash(value: unknown): value is string {
  return typeof value === "string" && /^[0123456789bcdefghjkmnpqrstuvwxyz]{1,12}$/.test(value);
}

function validateGeohash(value: unknown, latitude: number, longitude: number, id: string, findings: Findings): void {
  const expected = makeGeohash(latitude, longitude, expectedGeohashPrecision);
  if (!isValidGeohash(value) || value !== expected) {
    findings.error(id, "coordinates.geohash", `se esperaba ${expected} para las coordenadas y precisión ${expectedGeohashPrecision}.`);
    return;
  }
  if (value.length !== expectedGeohashPrecision) {
    findings.error(id, "coordinates.geohash", `se esperaba precisión ${expectedGeohashPrecision} (${expected}).`);
  }
}

function validateDistanceFromValladolid(latitude: number, longitude: number, id: string, findings: Findings): void {
  if (distanceKm(latitude, longitude, 20.6896, -88.2017) > 100) {
    findings.warning(id, "coordinates", "está a más de 100 km de Valladolid; revisa posible inversión o signo de coordenadas.");
  }
}

function validateNearDuplicate(latitude: number, longitude: number, base: Place[], id: string, findings: Findings): void {
  for (const other of base) {
    const coordinates = record(other.coordinates);
    if (typeof coordinates.latitude !== "number" || typeof coordinates.longitude !== "number") continue;
    if (distanceKm(latitude, longitude, coordinates.latitude, coordinates.longitude) < 0.05) {
      findings.warning(id, "coordinates", `está a menos de 50 m de ${String(other.name)}; revisa posible duplicado.`);
    }
  }
}

function validateOpeningHours(value: unknown, id: string, findings: Findings): void {
  if (!isRecord(value)) {
    findings.error(id, "openingHours", "se esperaba un objeto.");
    return;
  }
  validateExactKeys(value, ["status", "source", "observedOn", "weekly"], "openingHours", id, findings);
  if (value.status === "confirmed") {
    validateConfirmedHours(value, id, findings);
    return;
  }
  if (value.status === "unconfirmed" || value.status === "no-schedule") {
    validateUnconfirmedHours(value, id, findings);
    return;
  }
  findings.error(id, "openingHours.status", "se esperaba confirmed, unconfirmed o no-schedule.");
}

function validateConfirmedHours(hours: Dict, id: string, findings: Findings): void {
  if (!isNonEmptyString(hours.source)) {
    findings.error(id, "openingHours.source", "se esperaba una fuente no vacía.");
  }
  validateDate(hours.observedOn, id, "openingHours.observedOn", findings);
  const weekly = unknownArray(hours.weekly);
  if (!weekly || weekly.length !== openingDays.length) {
    findings.error(id, "openingHours.weekly", "se esperaban exactamente 7 días de monday a sunday.");
    return;
  }
  weekly.forEach((day, dayIndex) => validateDayHours(day, dayIndex, id, findings));
}

function validateDayHours(day: unknown, dayIndex: number, id: string, findings: Findings): void {
  validateExactKeys(day, ["day", "intervals"], `openingHours.weekly[${dayIndex}]`, id, findings);
  const value = record(day);
  if (value.day !== openingDays[dayIndex]) {
    findings.error(id, `openingHours.weekly[${dayIndex}].day`, `se esperaba ${openingDays[dayIndex]}.`);
  }
  const intervals = unknownArray(value.intervals);
  if (!intervals) {
    findings.error(id, `openingHours.weekly[${dayIndex}].intervals`, "se esperaba un arreglo de intervalos.");
    return;
  }
  intervals.forEach((interval, intervalIndex) => validateInterval(interval, dayIndex, intervalIndex, id, findings));
}

function validateInterval(interval: unknown, dayIndex: number, intervalIndex: number, id: string, findings: Findings): void {
  const path = `openingHours.weekly[${dayIndex}].intervals[${intervalIndex}]`;
  validateExactKeys(interval, ["opens", "closes"], path, id, findings);
  const value = record(interval);
  validateClockTime(value.opens, `${path}.opens`, id, findings);
  validateClockTime(value.closes, `${path}.closes`, id, findings);
}

function validateClockTime(value: unknown, path: string, id: string, findings: Findings): void {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    findings.error(id, path, "se esperaba una hora HH:MM entre 00:00 y 23:59.");
  }
}

function validateUnconfirmedHours(hours: Dict, id: string, findings: Findings): void {
  for (const field of ["source", "observedOn", "weekly"]) {
    if (hours[field] !== null) {
      findings.error(id, `openingHours.${field}`, `se esperaba null cuando status es ${String(hours.status)}.`);
    }
  }
}

function validateAccessCost(value: unknown, id: string, findings: Findings): void {
  if (!isRecord(value)) {
    findings.error(id, "accessCost", "se esperaba un objeto.");
    return;
  }
  validateExactKeys(value, ["status", "amountMXN"], "accessCost", id, findings);
  if (value.status === "free") {
    if (value.amountMXN !== 0) findings.error(id, "accessCost.amountMXN", "se esperaba 0 cuando status es free.");
    return;
  }
  if (value.status === "paid") {
    const validAmount = value.amountMXN === null
      || (typeof value.amountMXN === "number" && Number.isFinite(value.amountMXN) && value.amountMXN > 0);
    if (!validAmount) findings.error(id, "accessCost.amountMXN", "se esperaba un monto positivo o null cuando status es paid.");
    return;
  }
  if (value.status === "unknown" || value.status === "not-applicable") {
    if (value.amountMXN !== null) {
      findings.error(id, "accessCost.amountMXN", `se esperaba null cuando status es ${value.status}.`);
    }
    return;
  }
  findings.error(id, "accessCost.status", "se esperaba free, paid, unknown o not-applicable.");
}

function validateFoodService(value: unknown, id: string, base: Place[] | undefined, findings: Findings): void {
  if (!isRecord(value)) {
    findings.error(id, "foodService", "se esperaba un objeto.");
    return;
  }
  validateExactKeys(value, ["status", "foodTypes", "estimatedSpendPerPersonMXN"], "foodService", id, findings);
  if (value.status === "available") {
    validateAvailableFood(value, id, base, findings);
    return;
  }
  if (value.status === "unknown" || value.status === "not-applicable") {
    validateUnavailableFood(value, id, findings);
    return;
  }
  findings.error(id, "foodService.status", "se esperaba available, unknown o not-applicable.");
}

function validateAvailableFood(food: Dict, id: string, base: Place[] | undefined, findings: Findings): void {
  const foodTypes = unknownArray(food.foodTypes);
  if (food.foodTypes !== null && (!foodTypes || foodTypes.length === 0 || !foodTypes.every(isKebabCase))) {
    findings.error(id, "foodService.foodTypes", "se esperaba null o un arreglo no vacío de valores kebab-case.");
  }
  if (foodTypes && base) validateKnownFoodTypes(foodTypes, base, id, findings);
  if (food.estimatedSpendPerPersonMXN !== null) {
    validateSpend(food.estimatedSpendPerPersonMXN, id, base, findings);
  }
}

function validateKnownFoodTypes(foodTypes: unknown[], base: Place[], id: string, findings: Findings): void {
  const knownTypes = new Set<string>();
  for (const place of base) {
    const types = unknownArray(record(place.foodService).foodTypes);
    if (types) {
      for (const type of types) if (typeof type === "string") knownTypes.add(type);
    }
  }
  for (const foodType of foodTypes) {
    if (typeof foodType === "string" && !knownTypes.has(foodType)) {
      findings.warning(id, "foodService.foodTypes", `valor ${foodType} nuevo respecto al catálogo base; se acepta.`);
    }
  }
}

function validateSpend(value: unknown, id: string, base: Place[] | undefined, findings: Findings): void {
  validateExactKeys(value, ["min", "max", "currency", "basis", "source", "observedOn"], "foodService.estimatedSpendPerPersonMXN", id, findings);
  const spend = record(value);
  if (typeof spend.min !== "number" || !Number.isFinite(spend.min) || spend.min < 0) {
    findings.error(id, "foodService.estimatedSpendPerPersonMXN.min", "se esperaba un número finito ≥ 0.");
  }
  if (typeof spend.max !== "number" || !Number.isFinite(spend.max) || typeof spend.min !== "number" || spend.max < spend.min) {
    findings.error(id, "foodService.estimatedSpendPerPersonMXN.max", "se esperaba un número finito ≥ min.");
  }
  if (spend.currency !== "MXN") {
    findings.error(id, "foodService.estimatedSpendPerPersonMXN.currency", "se esperaba MXN.");
  }
  for (const field of ["basis", "source"]) {
    if (!isNonEmptyString(spend[field])) {
      findings.error(id, `foodService.estimatedSpendPerPersonMXN.${field}`, "se esperaba texto no vacío.");
    }
  }
  validateDate(spend.observedOn, id, "foodService.estimatedSpendPerPersonMXN.observedOn", findings);
  if (base && isNonEmptyString(spend.basis)) validateKnownSpendBasis(spend.basis, base, id, findings);
}

function validateKnownSpendBasis(basis: string, base: Place[], id: string, findings: Findings): void {
  const knownBases = new Set<string>();
  for (const place of base) {
    const spend = record(record(place.foodService).estimatedSpendPerPersonMXN);
    if (typeof spend.basis === "string") knownBases.add(spend.basis);
  }
  if (!knownBases.has(basis)) {
    findings.warning(id, "foodService.estimatedSpendPerPersonMXN.basis", `valor ${basis} nuevo respecto al catálogo base; se acepta.`);
  }
}

function validateUnavailableFood(food: Dict, id: string, findings: Findings): void {
  if (food.foodTypes !== null) {
    findings.error(id, "foodService.foodTypes", `se esperaba null cuando status es ${String(food.status)}.`);
  }
  if (food.estimatedSpendPerPersonMXN !== null) {
    findings.error(id, "foodService.estimatedSpendPerPersonMXN", `se esperaba null cuando status es ${String(food.status)}; la API rechaza gasto sin servicio disponible.`);
  }
}

function validateContact(value: unknown, id: string, findings: Findings): void {
  if (!isRecord(value)) {
    findings.error(id, "contact", "se esperaba un objeto.");
    return;
  }
  validateExactKeys(value, ["email", "phone", "website", "address"], "contact", id, findings);
  for (const field of ["email", "phone", "website", "address"]) {
    if (value[field] !== null && !isNonEmptyString(value[field])) {
      findings.error(id, `contact.${field}`, "se esperaba null o texto no vacío.");
    }
  }
  if (value.website !== null && isNonEmptyString(value.website) && !/^https?:\/\//.test(value.website)) {
    findings.error(id, "contact.website", "se esperaba una URL que comience con http:// o https://.");
  }
}

function validatePlace(value: unknown, label: string, base: Place[] | undefined, findings: Findings): Place | null {
  if (!isRecord(value)) {
    findings.error(label, "place", "se esperaba un objeto de lugar.");
    return null;
  }
  const id = isNonEmptyString(value.id) ? value.id : label;
  validateExactKeys(value, placeKeys, "", id, findings);
  validateIdentityAndZone(value, id, base, findings);
  validateCoordinates(value.coordinates, id, base, findings);
  validateOpeningHours(value.openingHours, id, findings);
  validateAccessCost(value.accessCost, id, findings);
  validateFoodService(value.foodService, id, base, findings);
  validateContact(value.contact, id, findings);
  return value;
}

function loadCatalog(value: unknown, file: string, findings: Findings): Place[] | null {
  if (!isRecord(value) || value.schemaVersion !== 6) {
    findings.error(file, "catalog", "se esperaba schemaVersion 6 y un arreglo places.");
    return null;
  }
  const rawPlaces = unknownArray(value.places);
  if (!rawPlaces) {
    findings.error(file, "catalog", "se esperaba schemaVersion 6 y un arreglo places.");
    return null;
  }
  if (rawPlaces.length === 0) {
    findings.error(file, "places", "el catálogo no contiene lugares; se esperaba al menos uno.");
    return null;
  }
  const places: Place[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const rawPlace of rawPlaces) {
    const place = validatePlace(rawPlace, "catalog", undefined, findings);
    if (!place) continue;
    const id = isNonEmptyString(place.id) ? place.id : "catalog";
    const name = isNonEmptyString(place.name) ? place.name : "";
    if (ids.has(id)) {
      findings.error(id, "id", "identificador duplicado; se esperaba único.");
    } else {
      ids.add(id);
    }
    if (names.has(name)) {
      findings.error(id, "name", "nombre duplicado; se esperaba único.");
    } else {
      names.add(name);
    }
    places.push(place);
  }
  return places;
}

function validateCorpus(corpus: string, places: Place[], file: string, findings: Findings): void {
  const fragments = extractCorpusFragments(corpus);
  for (const place of places) validatePlaceCorpus(place, fragments, findings);
  for (const fragment of fragments) {
    const isKnownPlace = places.some((place) => place.name === fragment.heading);
    if (!isKnownPlace) {
      findings.error(file, "corpus.heading", `se esperaba un nombre exacto del catálogo; no existe ${fragment.heading}.`);
    }
  }
}

function validatePlaceCorpus(place: Place, fragments: CorpusFragment[], findings: Findings): void {
  const id = isNonEmptyString(place.id) ? place.id : "catalog";
  const name = isNonEmptyString(place.name) ? place.name : "";
  const matchingFragments = fragments.filter((fragment) => fragment.heading === name);
  if (matchingFragments.length !== 1) {
    findings.error(id, "corpus", `se esperaba exactamente un fragmento ### ${name}; encontrados ${matchingFragments.length}.`);
  }
  for (const fragment of matchingFragments) {
    validateHorario(fragment.body, record(place.openingHours).status, id, findings, "corpus.Horario");
    validateDescription(fragment.body, id, findings, "corpus");
  }
}

function validateHorario(text: string, status: unknown, id: string, findings: Findings, field: string): void {
  const lines = text.split(/\r?\n/).filter((line) => line.startsWith("Horario:"));
  const [line] = lines;
  if (lines.length !== 1 || line === undefined) {
    findings.error(id, field, `se esperaba exactamente una línea Horario:; encontradas ${lines.length}.`);
    return;
  }
  if (status === "unconfirmed" && !line.startsWith("Horario: sin confirmar")) {
    findings.error(id, field, "se esperaba que comenzara Horario: sin confirmar.");
  }
  if (status === "no-schedule" && !line.includes("sin horario de apertura registrado")) {
    findings.error(id, field, "se esperaba que incluyera sin horario de apertura registrado.");
  }
  if (status === "confirmed" && !line.includes("(fuente:")) {
    findings.error(id, field, "se esperaba que incluyera (fuente: para horario confirmado.");
  }
}

const fragmentHeading = "### ";
const boundaryHeading = /^#{1,3} /;
const fenceOpening = /^ {0,3}(`{3,}|~{3,})/;
const fenceClosing = /^ {0,3}(`{3,}|~{3,})\s*$/;

function closesFence(line: string, opening: string): boolean {
  const marker = fenceClosing.exec(line)?.[1];
  return marker !== undefined && marker.charAt(0) === opening.charAt(0) && marker.length >= opening.length;
}

function isBlank(line: string): boolean {
  return line.trim() === "";
}

function trimBlankEnds(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && isBlank(lines[start] ?? "")) start++;
  while (end > start && isBlank(lines[end - 1] ?? "")) end--;
  return lines.slice(start, end);
}

function toFragment(heading: string, headingIndex: number, lines: string[]): CorpusFragment {
  const text = trimBlankEnds(lines);
  return {
    heading,
    body: trimBlankEnds(lines.slice(1)).join("\n"),
    text: text.join("\n"),
    startLine: headingIndex + 1,
    endLine: headingIndex + text.length,
  };
}

// A fragment starts at "### <name>" and ends before the next level 1-3
// heading, an exact "---" line, or EOF. Markers inside fenced code blocks are
// neither starts nor delimiters.
export function extractCorpusFragments(corpus: string): CorpusFragment[] {
  const lines = corpus.split(/\r?\n/);
  const fragments: CorpusFragment[] = [];
  let current: { heading: string; index: number; lines: string[] } | null = null;
  let fence: string | null = null;
  const finish = (): void => {
    if (current) fragments.push(toFragment(current.heading, current.index, current.lines));
    current = null;
  };
  lines.forEach((line, index) => {
    if (fence !== null) {
      if (closesFence(line, fence)) fence = null;
      current?.lines.push(line);
      return;
    }
    const opening = fenceOpening.exec(line)?.[1];
    if (opening !== undefined) {
      fence = opening;
      current?.lines.push(line);
      return;
    }
    if (boundaryHeading.test(line) || line === "---") {
      finish();
      if (line.startsWith(fragmentHeading)) current = { heading: line.slice(fragmentHeading.length), index, lines: [line] };
      return;
    }
    current?.lines.push(line);
  });
  finish();
  return fragments;
}

function validateDescription(body: string, id: string, findings: Findings, field: string): void {
  const hasDescription = body.split("\n").some((line) => !isBlank(line) && !line.startsWith("Horario:"));
  if (!hasDescription) {
    findings.error(id, field, "se esperaba una descripción además de la línea Horario:.");
  }
}

function checkDraftDuplicates(draft: Place, places: Place[] | null, findings: Findings): void {
  if (!places) return;
  const draftId = isNonEmptyString(draft.id) ? draft.id : "draft";
  const draftName = isNonEmptyString(draft.name) ? draft.name : "";
  if (places.some((place) => place.id === draft.id)) {
    findings.error(draftId, "id", "identificador ya existe en el catálogo; se esperaba uno nuevo.");
  }
  if (places.some((place) => isNonEmptyString(place.name) && normalizeName(place.name) === normalizeName(draftName))) {
    findings.error(draftId, "name", "nombre duplicado tras normalización; se esperaba uno nuevo.");
  }
}

function checkDraftFragment(draft: Place, fragment: string, findings: Findings): void {
  const id = isNonEmptyString(draft.id) ? draft.id : "draft";
  const name = isNonEmptyString(draft.name) ? draft.name : "";
  const fragments = extractCorpusFragments(fragment);
  const [only] = fragments;
  if (fragments.length !== 1 || only === undefined || only.heading !== name) {
    findings.error(id, "fragment.heading", `se esperaba exactamente ### ${name}.`);
    validateHorario(fragment, record(draft.openingHours).status, id, findings, "fragment.Horario");
    return;
  }
  validateHorario(only.body, record(draft.openingHours).status, id, findings, "fragment.Horario");
  validateDescription(only.body, id, findings, "fragment");
}

function reportOf(findings: Findings): ValidationReport {
  return { errors: [...findings.errors], warnings: [...findings.warnings] };
}

/** Full validation of a parsed catalog value and its corpus text. */
export function validateCatalogAndCorpus(
  catalog: unknown,
  corpus: string,
  labels: { catalog: string; corpus: string },
): ValidationReport {
  const findings = createFindings();
  const places = loadCatalog(catalog, labels.catalog, findings);
  if (places) validateCorpus(corpus, places, labels.corpus, findings);
  return reportOf(findings);
}

/** Validation of one draft (parsed place.json value and fragment.md text) against the current catalog. */
export function validateDraft(draft: unknown, fragment: string, catalog: unknown, catalogLabel: string): ValidationReport {
  const baseFindings = createFindings();
  const places = loadCatalog(catalog, catalogLabel, baseFindings);
  const findings = createFindings();
  const validatedDraft = validatePlace(draft, "draft", places ?? undefined, findings);
  if (validatedDraft) {
    checkDraftDuplicates(validatedDraft, places, findings);
    checkDraftFragment(validatedDraft, fragment, findings);
  }
  if (baseFindings.errors.length > 0) {
    findings.warning("catalog base", "catalog", `el catálogo existente ya tiene ${baseFindings.errors.length} error(es); se muestran solo hallazgos del borrador.`);
  }
  return reportOf(findings);
}
