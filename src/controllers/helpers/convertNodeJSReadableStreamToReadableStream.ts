export const convertNodeJSReadableStreamToReadableStream = async (
  oldReadableStream: NodeJS.ReadableStream,
): Promise<ReadableStream> => {
  return new ReadableStream({
    start: async (controller) => {
      controller.enqueue(await convertNodeJSReadableStreamToBuffer(oldReadableStream));
      controller.close();
    },
  });
};

const convertNodeJSReadableStreamToBuffer = async (
  oldReadableStream: NodeJS.ReadableStream,
): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const buffer = Array<any>();

    oldReadableStream.on('data', (chunk) => buffer.push(chunk));
    oldReadableStream.on('end', () => resolve(Buffer.concat(buffer)));
    oldReadableStream.on('error', (err) => reject(`error converting stream - ${err}`));
  });
};
