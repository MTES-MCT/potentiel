import { Middleware } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainError } from '@potentiel-domain/core';
import { getContext } from '@potentiel-applications/request-context';

export const logMiddleware: Middleware = async (message, next) => {
  const context = getContext();
  const correlationId = context?.correlationId ?? '';
  const utilisateur = context?.utilisateur?.identifiantUtilisateur?.email;
  const url = context?.url;
  getLogger().debug('Executing message', {
    message: JSON.stringify(message),
    utilisateur,
    correlationId,
  });
  try {
    const start = Date.now();
    const result = await next();
    const elapsed = Date.now() - start;
    const resultJson = getResultJsonBody(message.type, result);
    getLogger().debug('Message executed', {
      messageType: message.type,
      result: JSON.stringify(resultJson),
      correlationId,
      durationMS: elapsed,
      url,
    });
    return result;
  } catch (e) {
    if (e instanceof DomainError) {
      getLogger().warn(e.message, { meta: e.meta, messageType: message.type, correlationId });
    } else {
      getLogger().error(e as Error, { correlationId, messageType: message.type });
    }

    throw e;
  }
};

const messagesToTruncate = [
  'AppelOffre.Query.ConsulterAppelOffre',
  'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
];
// This is to avoid extremely long results from ConsulterAppelOffre, which makes the logs unreadable.
const getResultJsonBody = (messageType: string, result: unknown) => {
  if (messagesToTruncate.includes(messageType)) return {};
  if (isListResult(result)) {
    return {
      subtotal: result.items.length,
      total: result.total ?? result.items.length,
    };
  }
  return result;
};

const isListResult = (result: unknown): result is { total?: unknown; items: unknown[] } => {
  return !!result && typeof result === 'object' && 'items' in result && Array.isArray(result.items);
};
