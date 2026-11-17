import { LocateFixed, MapPin } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { LocationState } from "../model/use-location";

type LocationPromptProps = {
  location: LocationState;
  onUseLocation: () => void;
  onWriteZone: () => void;
};

const OFFER = "Para ordenar las opciones por cercanía puedo usar tu ubicación. ¿O prefieres escribir la zona?";
const UNAVAILABLE = "No pude obtener tu ubicación. Si quieres, escribe una zona, por ejemplo «centro».";

// Pachi bubble with the permission request and the written-zone alternative.
export function LocationPrompt({ location, onUseLocation, onWriteZone }: LocationPromptProps) {
  if (location.status === "idle") return null;

  const bubble = "flex max-w-[85%] flex-col gap-2.5 self-start rounded-lg rounded-bl-sm border border-border bg-surface px-[13px] py-2.5 text-body";

  if (location.status === "captured") {
    return <div className={bubble}>Listo, tengo tu ubicación en este navegador. Por ahora no la uso para buscar lugares.</div>;
  }
  if (location.status === "zone") {
    return <div className={bubble}>Zona de referencia: «{location.zone}». Por ahora no la uso para buscar lugares.</div>;
  }

  const unavailable = location.status === "unavailable";
  return (
    <div className={bubble}>
      <span>{unavailable ? UNAVAILABLE : OFFER}</span>
      <div className="flex flex-wrap gap-2">
        {!unavailable && (
          <Button variant="primary" onClick={onUseLocation} disabled={location.status === "requesting"}>
            <LocateFixed aria-hidden="true" className="size-4" />
            Usar mi ubicación
          </Button>
        )}
        <Button variant="secondary" onClick={onWriteZone}>
          <MapPin aria-hidden="true" className="size-4" />
          Escribir una zona
        </Button>
      </div>
    </div>
  );
}
