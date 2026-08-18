import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, relative, isAbsolute, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../data"
);

// Resolves a filename safely under ./data — rejects any path trying to escape it (e.g. "..")
function resolveDataPath(fileName: string): string {
  const fullPath = resolve(DATA_DIR, fileName);
  const rel = relative(DATA_DIR, fullPath);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(`Invalid data file path: ${fileName}`);
  }
  return fullPath;
}

export async function readDataFile(fileName: string): Promise<string> {
  const path = resolveDataPath(fileName);
  try {
    return await readFile(path, "utf-8");
  } catch (error) {
    throw new Error(`Failed to read data file "${fileName}": ${(error as Error).message}`);
  }
}

export async function writeDataFile(fileName: string, content: string): Promise<void> {
  const path = resolveDataPath(fileName);
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(path, content, "utf-8");
}