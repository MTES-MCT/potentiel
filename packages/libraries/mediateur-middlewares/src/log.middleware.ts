import { getLogger } from '@potentiel/monitoring';
import { randomUUID } from 'crypto';
import { Middleware } from 'mediateur';
import { DomainError } from '@potentiel-domain/core';

export const logMiddleware: Middleware = async (message, next) => {
  const correlationId = randomUUID();
  getLogger().info('Executing message', { message: JSON.stringify(message), correlationId });
  try {
    const result = await next();
    getLogger().info('Message executed', { result: JSON.stringify(result), correlationId });
    return result;
  } catch (e) {
    if (e instanceof DomainError) {
      getLogger().warn(e.message, { meta: e.meta });
    } else {
      getLogger().error(e as Error, { result: JSON.stringify(e), correlationId });
    }

    throw e;
  }
};
