import { Message, Middleware, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Utilisateur, VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel/monitoring';

type GetAuthenticatedUserMessage = Message<'GET_AUTHENTICATED_USER', {}, Utilisateur.ValueType>;

export const middleware: Middleware = async (message, next) => {
  if (isSystemProcess(message)) {
    return await next();
  }

  let utilisateur: Utilisateur.ValueType | undefined;
  try {
    utilisateur = await mediator.send<GetAuthenticatedUserMessage>({
      type: 'GET_AUTHENTICATED_USER',
      data: {},
    });
  } catch (error) {
    if (mustSkipMessage(message)) {
      getLogger().warn(
        `[permission.middleware] Fail to get access token probably because a system process trigger the message`,
        { type: message.type, data: message.data },
      );
      return await next();
    }

    throw new AuthenticationError(error as Error);
  }

  utilisateur.role.vérifierLaPermission(message.type);

  if (mustCheckProjetAccess(message)) {
    const identifiantProjetValue = getIdentifiantProjetValue(message);

    await mediator.send<VérifierAccèsProjetQuery>({
      type: 'VERIFIER_ACCES_PROJET_QUERY',
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

const isSystemProcess = (message: Message<string, Record<string, unknown>, void>) => {
  return (
    message.type === 'GET_AUTHENTICATED_USER' ||
    message.type === 'VERIFIER_ACCES_PROJET_QUERY' ||
    message.type.endsWith('_NOTIFICATION') ||
    message.type.endsWith('_PROJECTOR') ||
    message.type.endsWith('_SAGA')
  );
};

const mustSkipMessage = (message: Message<string, Record<string, unknown>, void>) => {
  return message.type.endsWith('GET_AUTHENTICATED_USER') || message.type.endsWith('_QUERY');
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
