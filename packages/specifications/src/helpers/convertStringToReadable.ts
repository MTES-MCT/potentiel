export const convertStringToReadableStream = (value: string) => {
  const content = new ReadableStream({
    start: async (controller) => {
      controller.enqueue(Buffer.from(value, 'utf-8'));
      controller.close();
    },
  });

  return content;
};
