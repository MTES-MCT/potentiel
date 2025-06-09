import { Message, Middleware, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { getContext } from '@potentiel-applications/request-context';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Accès } from '@potentiel-domain/projet';
import { InvalidOperationError } from '@potentiel-domain/core';

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

  const identifiantProjetValue = getIdentifiantProjetValues(message);

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

  return await next();
};

const isSystemProcess = (message: Message<string, Record<string, unknown>, void>) =>
  message.type.startsWith('System.');

const getIdentifiantProjetValues = (message: Message<string, Record<string, unknown>, void>) => {
  if (message.data['identifiantProjetValue']) {
    return [
      IdentifiantProjet.convertirEnValueType(
        message.data['identifiantProjetValue'] as string,
      ).formatter(),
    ];
  }

  if (message.data['identifiantProjet']) {
    if (typeof message.data['identifiantProjet'] === 'string') {
      return [
        IdentifiantProjet.convertirEnValueType(message.data['identifiantProjet']).formatter(),
      ];
    }
    return [
      IdentifiantProjet.bind(
        message.data['identifiantProjet'] as IdentifiantProjet.ValueType,
      ).formatter(),
    ];
  }
  if (message.data['identifiantsProjet']) {
    if (!Array.isArray(message.data['identifiantsProjet'])) {
      throw new InvalidOperationError('Le paramètre identifiantsProjet devrait être un array');
    }
    return message.data['identifiantsProjet'].map((identifantProjet) =>
      typeof identifantProjet === 'string'
        ? IdentifiantProjet.convertirEnValueType(identifantProjet).formatter()
        : IdentifiantProjet.bind(identifantProjet as IdentifiantProjet.ValueType).formatter(),
    );
  }
};
