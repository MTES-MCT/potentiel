import { Message, Middleware, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';

import * as Utilisateur from './utilisateur.valueType';
import { VérifierAccèsProjetQuery } from './vérifierAccèsProjet/vérifierAccèsProjet.query';

type GetAuthenticatedUserMessage = Message<
  'System.Authorization.RécupérerUtilisateur',
  {},
  Utilisateur.ValueType
>;

export const permissionMiddleware: Middleware = async (message, next) => {
  if (isSystemProcess(message)) {
    return await next();
  }

  let utilisateur: Utilisateur.ValueType | undefined;
  try {
    utilisateur = await mediator.send<GetAuthenticatedUserMessage>({
      type: 'System.Authorization.RécupérerUtilisateur',
      data: {},
    });
  } catch (error) {
    if (mustSkipMessage(message)) {
      /**
       * @todo Trouver un moyen de ne pas avoir une dépendance direct au logger (et donc sentry) car ça fait crasher le storybook
       */
      // getLogger().warn(
      //   `[permission.middleware] Fail to get access token probably because a system process trigger the message`,
      //   { type: message.type, data: message.data },
      // );
      return await next();
    }

    throw new AuthenticationError(error as Error);
  }

  utilisateur.role.vérifierLaPermission(message.type);

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

const mustSkipMessage = (message: Message<string, Record<string, unknown>, void>) => {
  return (
    message.type.endsWith('System.Authorization.RécupérerUtilisateur') ||
    message.type.includes('.Command.') || // Message to skip because executed by a saga or legacy app
    message.type.includes('.UseCase.') || // Message executed by the legacy app
    message.type.includes('.Query.') // Message executed by the legacy app
  );
};

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
