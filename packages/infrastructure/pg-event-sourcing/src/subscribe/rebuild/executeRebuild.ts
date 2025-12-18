import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const executeRebuild = async (streamCategory: string, streamId?: string) => {
  return streamId
    ? executeQuery('call event_store.rebuild($1, $2)', streamCategory, streamId)
    : executeQuery('call event_store.rebuild($1)', streamCategory);
};
