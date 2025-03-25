import { Response } from 'express';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';

export const docxContentType =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const downloadFile = (
  response: Response,
  {
    content,
    contentType,
    filename,
  }: { filename: string; content: ReadableStream; contentType: string },
) => {
  response.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  response.setHeader('Content-Type', contentType);
  Readable.fromWeb(content).pipe(response);
};
