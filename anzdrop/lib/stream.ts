const CHUNK_SIZE = 4 * 1024 * 1024;

export async function* streamFile(file: File) {
  const reader = file.stream().getReader();

  let buffer = new Uint8Array();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const merged = new Uint8Array(buffer.length + value.length);
    merged.set(buffer);
    merged.set(value, buffer.length);

    let offset = 0;

    while (merged.length - offset >= CHUNK_SIZE) {
      yield merged.slice(offset, offset + CHUNK_SIZE);
      offset += CHUNK_SIZE;
    }

    buffer = merged.slice(offset);
  }

  if (buffer.length > 0) {
    yield buffer;
  }
}