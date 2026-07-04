import { streamFile } from "./stream";
import { encryptChunk, packChunk } from "./crypto";

export async function encryptFile(
  file: File,
  key: CryptoKey
): Promise<Blob> {
  const encryptedChunks: BlobPart[] = [];

  for await (const chunk of streamFile(file)) {
    const { iv, ciphertext } = await encryptChunk(chunk, key);

    const packed = packChunk(iv, ciphertext);

    const header = createLengthHeader(packed.length);

    encryptedChunks.push(header);
    encryptedChunks.push(new Uint8Array(packed));
  }
  return new Blob(encryptedChunks);
}

function createLengthHeader(
  length: number
): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(4);

  const header = new Uint8Array(buffer);

  new DataView(buffer).setUint32(0, length);

  return header;
}