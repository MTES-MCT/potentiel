import { readFile } from 'fs/promises';

export class FileReadableStream extends ReadableStream<Uint8Array> {
  constructor(filePath: string) {
    super({
      start: async (controller) => {
        const data = await readFile(filePath);
        controller.enqueue(data);
        controller.close();
      },
    });
  }
}
