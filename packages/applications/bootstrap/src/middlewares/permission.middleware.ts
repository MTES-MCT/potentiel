import { Message, Middleware, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { getContext } from '@potentiel-applications/request-context';
import { UtilisateurEntity, VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Where, WhereOptions } from '@potentiel-domain/entity';
import { OperationRejectedError } from '@potentiel-domain/core';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

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
      message.type === 'Utilisateur.UseCase.RéclamerProjet' ||
      message.type === 'Utilisateur.Command.RéclamerProjet'
    ) {
      await vérifierQueLeProjetEstÀRéclamer(identifiantProjetValue);
      return await next();
    }

    await mediator.send<VérifierAccèsProjetQuery>({
      type: 'System.Authorization.VérifierAccèsProjet',
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

const vérifierQueLeProjetEstÀRéclamer = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const where: WhereOptions<UtilisateurEntity> = {
    rôle: Where.equal('porteur-projet'),
    projets: Where.include(identifiantProjet),
  };
  const utilisateurs = await listProjection<UtilisateurEntity>('utilisateur', {
    where,
    range: {
      startPosition: 0,
      endPosition: 1,
    },
  });
  if (utilisateurs.total > 0) {
    throw new ProjetNonRéclamableError();
  }
};

class ProjetNonRéclamableError extends OperationRejectedError {
  constructor() {
    super(`Le projet ne peut être réclamé`);
  }
}
