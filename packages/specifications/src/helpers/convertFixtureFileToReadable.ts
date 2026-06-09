import { Readable } from 'node:stream';

import type { PièceJustificative } from './PièceJustificative.js';

export const convertFixtureFileToReadableStream = ({ format, content }: PièceJustificative) => {
  return {
    format,
    content: Readable.toWeb(Readable.from(content)),
  };
};
