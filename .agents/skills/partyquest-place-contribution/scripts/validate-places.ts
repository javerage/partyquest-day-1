import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCatalogAndCorpus, validateDraft, type ValidationReport } from "./place-validation.ts";

type CliOptions = Map<string, string>;

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (cause) {
    const reason = cause instanceof SyntaxError ? "JSON inválido" : "no se pudo leer el archivo";
    throw new Error(`${path}: ${reason}`);
  }
}

function parseOptions(args: string[]): CliOptions | null {
  const options: CliOptions = new Map();
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    const value = args[index + 1];
    if (!key || !["--catalog", "--corpus", "--draft"].includes(key) || !value || value.startsWith("--") || options.has(key)) {
      return null;
    }
    options.set(key, value);
    index++;
  }
  if (!options.has("--catalog") || !options.has("--corpus")) return null;
  return options;
}

function option(options: CliOptions, name: string): string | null {
  const value = options.get(name);
  return value === undefined ? null : value;
}

function usageError(message: string): number {
  console.error(message);
  return 2;
}

function loadInputs(options: CliOptions): { catalog: unknown; corpus: string } | null {
  const catalogPath = option(options, "--catalog");
  const corpusPath = option(options, "--corpus");
  if (!catalogPath || !corpusPath) return null;
  try {
    return {
      catalog: readJson(catalogPath),
      corpus: readFileSync(corpusPath, "utf8"),
    };
  } catch (cause) {
    console.error(cause instanceof Error ? cause.message : "Error de lectura");
    return null;
  }
}

function report(result: ValidationReport): number {
  for (const line of result.errors) console.log(line);
  for (const line of result.warnings) console.log(line);
  console.log(`Resumen: ${result.errors.length} error(es), ${result.warnings.length} aviso(s).`);
  return result.errors.length > 0 ? 1 : 0;
}

function runDraftValidation(draftFolder: string, catalog: unknown, catalogPath: string): number {
  let draft: unknown;
  let fragment: string;
  try {
    draft = readJson(join(draftFolder, "place.json"));
    fragment = readFileSync(join(draftFolder, "fragment.md"), "utf8");
  } catch (cause) {
    return usageError(cause instanceof Error ? cause.message : "Error de lectura");
  }
  return report(validateDraft(draft, fragment, catalog, catalogPath));
}

function main(args: string[]): number {
  const options = parseOptions(args);
  if (!options) {
    return usageError("Uso: node scripts/validate-places.ts --catalog <places.json> --corpus <corpus.md> [--draft <directorio>]");
  }
  const inputs = loadInputs(options);
  if (!inputs) return 2;
  const catalogPath = option(options, "--catalog") ?? "catalog";
  const corpusPath = option(options, "--corpus") ?? "corpus";
  const draftFolder = option(options, "--draft");
  if (draftFolder) return runDraftValidation(draftFolder, inputs.catalog, catalogPath);
  return report(validateCatalogAndCorpus(inputs.catalog, inputs.corpus, { catalog: catalogPath, corpus: corpusPath }));
}

process.exitCode = main(process.argv.slice(2));
