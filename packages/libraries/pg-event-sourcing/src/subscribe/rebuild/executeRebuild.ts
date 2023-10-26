import { executeQuery } from '@potentiel/pg-helpers';

/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export const executeRebuild = async (streamCategory: string, streamId?: string) => {
  return !streamId
    ? executeQuery('call event_store.rebuild($1)', streamCategory)
    : executeQuery('call event_store.rebuild($1, $2)', streamCategory, streamId);
};
