import { randomUUID } from 'crypto';

import { Middleware } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainError } from '@potentiel-domain/core';

export const logMiddleware: Middleware = async (message, next) => {
  const correlationId = randomUUID();
  getLogger().debug('Executing message', { message: JSON.stringify(message), correlationId });
  try {
    const result = await next();
    const resultJson = getResultJsonBody(message.type, result);
    getLogger().debug('Message executed', {
      messageType: message.type,
      result: JSON.stringify(resultJson),
      correlationId,
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
  'AppelOffre.Query.ListerAppelOffre',
  'AppelOffre.Query.ConsulterAppelOffre',
];
// This is to avoid extremely long results from ConsulterAppelOffre, which makes the logs unreadable.
const getResultJsonBody = (messageType: string, result: unknown) => {
  if (messagesToTruncate.includes(messageType)) return {};
  return result;
};
