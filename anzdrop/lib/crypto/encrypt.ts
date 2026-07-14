import { generateIV } from "./key";
import type { EncryptionResult } from "./types";

// 1チャンクをAES-256-GCMで暗号化する
export async function encryptChunk(
  plaintext: BufferSource,
  key: CryptoKey
): Promise<EncryptionResult> {
  const iv = generateIV();

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(iv),
    },
    key,
    plaintext
  );

  return {
    iv,
    ciphertext,
  };
}