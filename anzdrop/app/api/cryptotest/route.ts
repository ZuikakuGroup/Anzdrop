import {
  generateKey,
  exportKey,
  importKey,
} from "../../../lib/crypto/key";

import {
  encodeBase64Url,
  decodeBase64Url,
} from "../../../lib/crypto/";

export async function GET() {
  try {
    const key = await generateKey();

    const raw = await exportKey(key);

    const encoded = encodeBase64Url(raw);

    const decoded = decodeBase64Url(encoded);

    await importKey(decoded);

    return Response.json({
      success: true,
      rawLength: raw.byteLength,
      decodedLength: decoded.byteLength,
      encoded,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}