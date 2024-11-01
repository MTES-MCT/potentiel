import * as zod from 'zod';

import { post } from '@potentiel-libraries/http-client';

const schema = zod.object({
  token: zod.string().min(1),
});

const apiUrl = process.env.FILIGRANE_FACILE_ENDPOINT;
const url = new URL(`${apiUrl}/api/document/files`);

export const postFile = async (watermark: string, file: Blob): Promise<string> => {
  // const blob = await toBlob(file);

  const response = await post(url, { watermark, files: file });

  const result = schema.parse(response);

  return result.token;
};

// const toBlob = async (file: ReadableStream): Promise<Blob> => {
//   const reader = file.getReader();
//   const chunks = [];

//   let continueReadingFile = true;
//   while (continueReadingFile) {
//     const { done, value } = await reader.read();
//     if (done) {
//       continueReadingFile = false;
//       continue;
//     }
//     chunks.push(value);
//   }

//   const blob = new Blob(chunks);
//   return blob;
// };
