// AES-256-GCMの鍵を生成する
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// CryptoKeyをBase64URL文字列へ変換する
export async function exportKey(key: CryptoKey): Promise<string> {
  const rawKey = await crypto.subtle.exportKey("raw", key);

  const bytes = new Uint8Array(rawKey);

  const base64 = btoa(String.fromCharCode(...bytes));

  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Base64URL文字列からCryptoKeyを復元する
export async function importKey(keyString: string): Promise<CryptoKey> {
  const base64 = keyString
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded = base64.padEnd(
    base64.length + (4 - (base64.length % 4)) % 4,
    "="
  );

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return crypto.subtle.importKey(
    "raw",
    bytes,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt", "decrypt"]
  );
}