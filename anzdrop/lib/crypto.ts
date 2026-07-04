import { uint8ArrayToBase64 } from "./encoding";

// 1チャンクをAES-256-GCMで暗号化する
export async function encryptChunk(
  chunk: Uint8Array<ArrayBuffer>,
  key: CryptoKey
): Promise<{
  iv: Uint8Array<ArrayBuffer>;
  ciphertext: Uint8Array<ArrayBuffer>;
}> {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    chunk.slice().buffer
  );

  return {
    iv,
    ciphertext: new Uint8Array(encrypted)
  };
}

// 1チャンクをAES-256-GCMで復号する
export async function decryptChunk(
  iv: Uint8Array<ArrayBuffer>,
  ciphertext: Uint8Array<ArrayBuffer>,
  key: CryptoKey
): Promise<Uint8Array<ArrayBuffer>> {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource,
    },
    key,
    ciphertext as BufferSource
  );

  return new Uint8Array(decrypted);
}

// IVと暗号文を1つのデータへまとめる
export function packChunk(
  iv: Uint8Array<ArrayBuffer>,
  ciphertext: Uint8Array<ArrayBuffer>
): Uint8Array<ArrayBuffer> {
  const packed = new Uint8Array(iv.length + ciphertext.length);

  packed.set(iv, 0);
  packed.set(ciphertext, iv.length);

  return packed;
}

// 保存されたチャンクをIVと暗号文へ分割する
export function unpackChunk(
  packed: Uint8Array
): {
  iv: Uint8Array<ArrayBuffer>;
  ciphertext: Uint8Array<ArrayBuffer>;
} {
  const iv = packed.slice(0, 12);
  const ciphertext = packed.slice(12);

  return {
    iv,
    ciphertext,
  };
}