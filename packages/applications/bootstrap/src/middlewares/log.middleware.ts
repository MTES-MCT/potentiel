import { randomUUID } from 'node:crypto';

import { Middleware } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainError } from '@potentiel-domain/core';
import { getContext } from '@potentiel-applications/request-context';
import { Entity, ListResult } from '@potentiel-domain/entity';

export const logMiddleware: Middleware = async (message, next) => {
  const context = getContext();
  const correlationId = context?.correlationId ?? randomUUID();
  const utilisateur = context?.utilisateur?.identifiantUtilisateur?.email;
  const url = context?.url;
  getLogger().info('Executing message', {
    message: JSON.stringify(message),
    utilisateur,
    correlationId,
  });
  try {
    const start = Date.now();
    const result = await next();
    const elapsed = Date.now() - start;
    const resultJson = getResultJsonBody(message.type, result);
    getLogger().info('Message executed', {
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
  'AppelOffre.Query.ListerAppelOffre',
  'AppelOffre.Query.ConsulterAppelOffre',
  'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
  'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
];
// This is to avoid extremely long results from ConsulterAppelOffre, which makes the logs unreadable.
const getResultJsonBody = (messageType: string, result: unknown) => {
  if (messagesToTruncate.includes(messageType)) return {};
  if (isListResult(result)) {
    return {
      subtotal: result.items.length,
      total: result.total,
    };
  }
  return result;
};

const isListResult = (result: unknown): result is ListResult<Entity> => {
  return (
    typeof result === 'object' &&
    !!result &&
    'total' in result &&
    typeof result.total === 'number' &&
    'items' in result &&
    Array.isArray(result.items)
  );
};
