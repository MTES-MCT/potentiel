import { extension } from 'mime-types';
import type core from 'express-serve-static-core';
import { logger } from '../../core/utils';

type SendFileOptions = {
  fileName: string;
  mimeType: string;
  content: ReadableStream;
};

export const sendFile = async (
  response: core.Response,
  { content, fileName, mimeType }: SendFileOptions,
) => {
  const extensionFichier = extension(mimeType);

  try {
    const reader = content.getReader();

    response.type(mimeType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.${extensionFichier}`,
    );

    const readFile = async () => {
      const result = await reader.read();
      if (result.done) {
        reader.releaseLock();
        response.status(200).end();
      } else {
        response.write(result.value);
        return await readFile();
      }
    };
    await readFile();
  } catch (e) {
    logger.error(e);
    response.status(500).end();
  }
};
