import { Message, Middleware, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { getContext } from '@potentiel-applications/request-context';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Accès } from '@potentiel-domain/projet';

import { AuthenticationError } from '../errors';

export const permissionMiddleware: Middleware = async (message, next) => {
  if (isSystemProcess(message)) {
    return await next();
  }

  const context = getContext();
  if (!context) {
    getLogger().warn('no context', { messageType: message.type });
    return await next();
  }
  const utilisateur = context.utilisateur;
  if (!utilisateur) {
    throw new AuthenticationError();
  }

  utilisateur.role.peutExécuterMessage(message.type);

  if (mustCheckProjetAccess(message)) {
    const identifiantProjetValue = getIdentifiantProjetValue(message);

    // Le cas de RéclamerProjet est une exception,
    // car l'utilisateur n'a pas encore accès au projet.
    if (
      message.type === 'Projet.Accès.UseCase.RéclamerAccèsProjet' ||
      message.type === 'Projet.Accès.Command.RéclamerAccèsProjet'
    ) {
      return await next();
    }

    await mediator.send<Accès.VérifierAccèsProjetQuery>({
      type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
      data: {
        identifiantProjetValue,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });
  }

  return await next();
};

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
