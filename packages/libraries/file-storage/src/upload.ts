import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { streamToArrayBuffer } from './streamToArrayBuffer.js';

export const upload = async (filePath: string, content: ReadableStream) => {
  const buffer = await streamToArrayBuffer(content);
  await executeQuery(
    'insert into document_store.files (key, content) values ($1, $2) on conflict (key) do update set content = excluded.content, updated_at=NOW()',
    filePath,
    buffer,
  );
};
