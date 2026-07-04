export function uint8ArrayToBase64(
  data: Uint8Array<ArrayBuffer>
): string {
  let binary = "";

  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}