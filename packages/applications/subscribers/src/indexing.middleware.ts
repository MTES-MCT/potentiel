import { bulkhead } from 'cockatiel';
import type { Middleware } from 'mediateur';

import { refreshOneIndex } from '@potentiel-infrastructure/pg-projection-read';
import { getLogger } from '@potentiel-libraries/monitoring';

// 5 seconds cache to ignore cascading updates, like notification
// const cache = new Cache<boolean>({ defaultTtl: 5000, autoCleanupInterval: 60000 });
const cache = new Map<string, NodeJS.Timeout>();

/**
 * The indexing middleware is reponsible for firing a refresh on the search_projects view at each projection update.
 * Runs after the message.
 */
export const indexingMiddleware: Middleware = async ({ type, data }, next) => {
  const nextResult = await next();

  // Ignore messages other than projector
  // Improvement : use a regex when available https://github.com/spontoreau/mediateur/issues/37
  if (
    !type.startsWith('System.Projector') ||
    type === 'System.Projector.Historique' ||
    !hasIdentifiantProjet(data)
  ) {
    return nextResult;
  }

  const logger = getLogger('indexing');

  const { identifiantProjet } = data.payload;
  const policy = bulkhead(1, Infinity);

  try {
    const exitingEntry = cache.get(identifiantProjet);
    if (exitingEntry) {
      clearTimeout(exitingEntry);
    }
    // delay 1 second, so that cascading updates only trigger once, on the last update
    const timeout = setTimeout(async () => {
      await policy.execute(() => refreshOneIndex(identifiantProjet));
      logger.debug('Search index refreshed', { identifiantProjet });
      cache.delete(identifiantProjet);
    }, 1000);
    cache.set(identifiantProjet, timeout);
  } catch (e) {
    logger.error('Indexing failed', { identifiantProjet, error: e });
    cache.delete(identifiantProjet);
  }
  return nextResult;
};

const hasIdentifiantProjet = (
  data: Record<string, unknown>,
): data is { payload: { identifiantProjet: string } } => {
  return (
    data &&
    'payload' in data &&
    data.payload !== null &&
    typeof data.payload === 'object' &&
    'identifiantProjet' in data.payload
  );
};
