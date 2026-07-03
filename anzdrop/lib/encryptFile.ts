import { streamFile } from "./stream";
import { encryptChunk, packChunk } from "./crypto";

export async function encryptFile(
  file: File,
  key: CryptoKey
): Promise<Blob> {
  const encryptedChunks: BlobPart[] = [];

  for await (const chunk of streamFile(file)) {
    // 次のステップで暗号化する
  }

  return new Blob(encryptedChunks);
}