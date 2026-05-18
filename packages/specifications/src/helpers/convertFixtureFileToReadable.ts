import { convertStringToReadableStream } from './convertStringToReadableStream.js';
import type { PièceJustificative } from './PièceJustificative.js';

export const convertFixtureFileToReadableStream = ({ format, content }: PièceJustificative) => {
  return {
    format,
    content: convertStringToReadableStream(content),
  };
};
