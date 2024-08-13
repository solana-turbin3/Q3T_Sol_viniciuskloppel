import { createGenericFile } from "@metaplex-foundation/umi";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getMimeTypeFromExtension } from "~/constants/mimeTypes";

export function readFile(filePath: string, fileName = path.basename(filePath)) {
  const fileExtension = path.extname(filePath);
  const mimeType = getMimeTypeFromExtension(fileExtension);

  const file = readFileSync(path.join(__dirname, filePath));

  const umiFile = createGenericFile(file, fileName, {
    tags: [{ name: "Content-Type", value: mimeType }],
    contentType: mimeType,
  });

  return umiFile;
}
