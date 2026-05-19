import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const copyFolder = async (sourceKey: string, targetKey: string) => {
  sourceKey = sourceKey.replace(/\/?$/, '/');
  targetKey = targetKey.replace(/\/?$/, '/');

  await executeQuery(
    `insert into document_store.files (key, content)
    select regexp_replace(key, $1, $2) as key, content
    from document_store.files
    where key like $3`,
    `^${sourceKey}`,
    `${targetKey}`,
    `${sourceKey}%`,
  );
};
