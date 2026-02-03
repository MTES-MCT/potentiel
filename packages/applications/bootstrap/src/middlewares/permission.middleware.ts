import { Message, Middleware, mediator } from 'mediateur';

import { getContext } from '@potentiel-applications/request-context';
import { Accès, IdentifiantProjet } from '@potentiel-domain/projet';
import { InvalidOperationError } from '@potentiel-domain/core';
import { getLogger } from '@potentiel-libraries/monitoring';

import { AuthenticationError } from '../errors.js';

export const permissionMiddleware: Middleware = async (message, next) => {
  if (isSystemProcess(message)) {
    return await next();
  }

  const context = getContext();
  if (!context) {
    getLogger().warn('no context', { messageType: message.type });
  }
  const utilisateur = context?.utilisateur;
  if (!utilisateur) {
    throw new AuthenticationError();
  }

  utilisateur.rôle.peutExécuterMessage(message.type);

  // Le cas de RéclamerProjet est une exception,
  // car l'utilisateur n'a pas encore accès au projet.
  if (
    message.type === 'Projet.Accès.UseCase.RéclamerAccèsProjet' ||
    message.type === 'Projet.Accès.Command.RéclamerAccèsProjet'
  ) {
    return await next();
  }

  for (const identifiantProjetValue of getIdentifiantProjetValues(message)) {
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

const getIdentifiantProjetValues = (message: Message<string, Record<string, unknown>, void>) => {
  if (message.data['identifiantProjetValue']) {
    return [toIdentifiantProjet(message.data['identifiantProjetValue'])];
  }

  if (message.data['identifiantProjet']) {
    return [toIdentifiantProjet(message.data['identifiantProjet'])];
  }

  if (message.data['identifiantsProjet']) {
    if (!Array.isArray(message.data['identifiantsProjet'])) {
      throw new InvalidOperationError('Le paramètre identifiantsProjet devrait être un array');
    }
    return message.data['identifiantsProjet'].map(toIdentifiantProjet);
  }
  return [];
};

const toIdentifiantProjet = (identifiantProjet: unknown) =>
  typeof identifiantProjet === 'string'
    ? IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()
    : IdentifiantProjet.bind(identifiantProjet as IdentifiantProjet.ValueType).formatter();
