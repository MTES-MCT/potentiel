import { Message, Middleware, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { getContext } from '@potentiel-applications/request-context';
import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';

export const permissionMiddleware: Middleware = async (message, next) => {
  if (isSystemProcess(message)) {
    return await next();
  }

  const context = getContext();
  if (!context) {
    return;
  }
  const utilisateur = context.utilisateur;
  if (!utilisateur) {
    throw new AuthenticationError();
  }

  utilisateur.role.peutExécuterMessage(message.type);

  if (mustCheckProjetAccess(message)) {
    const identifiantProjetValue = getIdentifiantProjetValue(message);

    await mediator.send<VérifierAccèsProjetQuery>({
      type: 'System.Authorization.VérifierAccésProjet',
      data: {
        identifiantProjetValue,
        utilisateur,
      },
    });
  }

  return await next();
};

class AuthenticationError extends Error {
  constructor(cause?: Error) {
    super(`Authentification obligatoire`, { cause });
  }
}

const isSystemProcess = (message: Message<string, Record<string, unknown>, void>) =>
  message.type.startsWith('System.');

const mustCheckProjetAccess = (message: Message<string, Record<string, unknown>, void>) => {
  return message.data['identifiantProjet'] || message.data['identifiantProjetValue'];
};

const getIdentifiantProjetValue = (message: Message<string, Record<string, unknown>, void>) => {
  if (message.data['identifiantProjetValue']) {
    return IdentifiantProjet.convertirEnValueType(
      message.data['identifiantProjetValue'] as string,
    ).formatter();
  }

  if (typeof message.data['identifiantProjet'] === 'string') {
    return IdentifiantProjet.convertirEnValueType(
      message.data['identifiantProjet'] as string,
    ).formatter();
  }

  const valueType = message.data['identifiantProjet'] as IdentifiantProjet.ValueType;
  return valueType.formatter();
};
