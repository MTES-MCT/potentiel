import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Accès } from '@potentiel-domain/projet';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger, ok } from '../core/utils';
import { eventStore } from '../config/eventStore.config';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';
import { Role } from '@potentiel-domain/utilisateur';
import {
  ToutAccèsAuProjetRevoqué,
  UserInvitedToProject,
  UserRightsToProjectRevoked,
} from '../modules/authZ';
import { createUser } from '../config';

export type SubscriptionEvent = Accès.AccèsEvent & Event;

export type Execute = Message<'System.Saga.Accès', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    switch (type) {
      case 'AccèsProjetAutorisé-V1': {
        const { identifiantUtilisateur, identifiantProjet, autoriséPar } = payload;

        const projectIds: string[] = [];
        const project = await getLegacyProjetByIdentifiantProjet(
          IdentifiantProjet.convertirEnValueType(identifiantProjet),
        );
        if (project) {
          projectIds.push(project.id);
        }

        const userId = await getOrCreateUser(identifiantUtilisateur, 'porteur-projet');

        const invitéParUserId = await getUserIdByEmail(autoriséPar);

        await eventStore.publish(
          new UserInvitedToProject({
            payload: {
              userId: userId,
              projectIds,
              invitedBy: invitéParUserId,
            },
          }),
        );

        break;
      }

      case 'AccèsProjetRetiré-V1': {
        const { identifiantProjet, identifiantUtilisateurs, retiréPar, cause } = payload;

        for (const identifiantUtilisateur of identifiantUtilisateurs) {
          const porteurId = await getOrCreateUser(identifiantUtilisateur, 'porteur-projet');
          const retiréParUserId = await getUserIdByEmail(retiréPar);

          const project = await getLegacyProjetByIdentifiantProjet(
            IdentifiantProjet.convertirEnValueType(identifiantProjet),
          );

          if (!project) {
            logger.warning('Project not found', { event, context: 'Legacy Utilisateur Saga' });
            break;
          }
          if (cause === 'changement-producteur') {
            await eventStore.publish(
              new ToutAccèsAuProjetRevoqué({
                payload: {
                  projetId: project.id,
                  cause: 'changement producteur',
                },
              }),
            );
          } else {
            await eventStore.publish(
              new UserRightsToProjectRevoked({
                payload: {
                  projectId: project.id,
                  userId: porteurId,
                  revokedBy: retiréParUserId,
                },
              }),
            );
          }
        }
        break;
      }
    }
  };

  mediator.register('System.Saga.Accès', handler);
};

const getUserIdByEmail = async (email: string) =>
  new Promise<string>((r) =>
    getUserByEmail(email).map((user) => {
      r(user?.id ?? '');
      return ok(user);
    }),
  );

const getOrCreateUser = async (email: string, role: Role.RawType) => {
  const userId = await getUserIdByEmail(email);
  if (userId) {
    return userId;
  }
  return new Promise<string>((r) =>
    createUser({ role, email }).map(({ id }) => {
      r(id);
      return ok(id);
    }),
  );
};
