import { Readable } from 'stream';

export const convertStringToReadable = (value: string) => {
  return Readable.from([value], { objectMode: true });
};
