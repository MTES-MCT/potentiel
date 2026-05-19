import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const upload = async (filePath: string, content: ReadableStream) => {
  await executeQuery(
    'insert into document_store.files (key, content) values ($1, $2) on conflict (key) do update set content = excluded.content, updated_at=NOW()',
    filePath,
    content,
  );
};
