import { convertStringToReadableStream } from './convertStringToReadable';

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
