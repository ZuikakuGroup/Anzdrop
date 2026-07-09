import {
  generateKey,
  encryptChunk,
  decryptChunk,
} from "../../../lib/crypto";

export async function GET() {
  try {
    const key = await generateKey();

    const encoder = new TextEncoder();

    const decoder = new TextDecoder();

    const original = "Hello Anzdrop!";

    const plaintext = encoder.encode(original);

    const encrypted = await encryptChunk(
      plaintext.buffer,
      key
    );

    const decrypted = await decryptChunk(
      encrypted.ciphertext,
      encrypted.iv,
      key
    );

    const restored = decoder.decode(decrypted);

    return Response.json({
      success: true,
      original,
      restored,
      match: original === restored,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: String(error),
    });

  }
}