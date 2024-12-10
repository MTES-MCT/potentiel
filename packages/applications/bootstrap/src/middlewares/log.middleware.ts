import { Middleware } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainError } from '@potentiel-domain/core';
import { getContext } from '@potentiel-applications/request-context';

export const logMiddleware: Middleware = async (message, next) => {
  const context = getContext();
  const correlationId = context?.correlationId ?? '';
  const utilisateur = context?.utilisateur?.identifiantUtilisateur?.email;
  const logger = getLogger('Bootstrap.middlewares.logMiddleware');

  logger.info('Executing message', {
    message: JSON.stringify(message),
    utilisateur,
    correlationId,
  });
  try {
    const result = await next();
    const resultJson = getResultJsonBody(message.type, result);
    logger.info('Message executed', {
      messageType: message.type,
      result: JSON.stringify(resultJson),
      correlationId,
    });
    return result;
  } catch (e) {
    if (e instanceof DomainError) {
      logger.warn(e.message, {
        meta: e.meta,
        messageType: message.type,
        correlationId,
      });
    } else {
      logger.error(e as Error, {
        correlationId,
        messageType: message.type,
      });
    }

    throw e;
  }
};

const messagesToTruncate = [
  'AppelOffre.Query.ListerAppelOffre',
  'AppelOffre.Query.ConsulterAppelOffre',
  'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
];
// This is to avoid extremely long results from ConsulterAppelOffre, which makes the logs unreadable.
const getResultJsonBody = (messageType: string, result: unknown) => {
  if (messagesToTruncate.includes(messageType)) return {};
  return result;
};
