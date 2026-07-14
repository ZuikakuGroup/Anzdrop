import { CHUNK_SIZE } from "./types";

// Fileを一定サイズずつ読み込む
export async function* iterateFileChunks(
  file: File
): AsyncGenerator<Uint8Array> {

  let offset = 0;

  while (offset < file.size) {

    const end = Math.min(
      offset + CHUNK_SIZE,
      file.size
    );

    const chunk = file.slice(offset, end);

    const buffer = await chunk.arrayBuffer();

    yield new Uint8Array(buffer);

    offset = end;
  }

}