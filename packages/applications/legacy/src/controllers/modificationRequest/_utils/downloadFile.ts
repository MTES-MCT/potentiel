import { Response } from 'express';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';

export const docxContentType =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

type DownloadFileProps = {
  filename: string;
  content: ReadableStream;
  contentType: string;
};
export const downloadFile = (
  response: Response,
  { content, contentType, filename }: DownloadFileProps,
) => {
  response.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  response.setHeader('Content-Type', contentType);
  Readable.fromWeb(content).pipe(response);
};
