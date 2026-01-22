import { convertStringToReadableStream } from './convertStringToReadable.js';

export const convertFixtureFileToReadableStream = ({
  format,
  content,
}: {
  format: string;
  content: string;
}) => {
  return {
    format,
    content: convertStringToReadableStream(content),
  };
};
