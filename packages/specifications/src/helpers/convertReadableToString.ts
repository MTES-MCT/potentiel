export const convertReadableStreamToString = async (readable: ReadableStream<any>) => {
  const reader = readable.getReader();

  const chunks: Buffer[] = [];

  const readFile = async (): Promise<void> => {
    const result = await reader.read();
    if (result.done) {
      reader.releaseLock();
    } else {
      chunks.push(Buffer.from(result.value));
      return await readFile();
    }
  };
  await readFile();

  return Buffer.concat(chunks).toString('utf-8');
};
