import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger, ok } from '../core/utils';
import { eventStore } from '../config/eventStore.config';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';
import { Role, UtilisateurEvent } from '@potentiel-domain/utilisateur';
import {
  DrealUserInvited,
  ToutAccèsAuProjetRevoqué,
  UserInvitedToProject,
  UserRightsToProjectRevoked,
} from '../modules/authZ';
import { createUser } from '../config';
import { ProjectClaimedByOwner } from '../modules/projectClaim';
import { UtilisateurInvité } from '../modules/utilisateur';
import { Région } from '../modules/dreal/région';

export type SubscriptionEvent = UtilisateurEvent & Event;

export type Execute = Message<'System.Saga.Utilisateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    switch (type) {
      case 'PorteurInvité-V1': {
        const { identifiantUtilisateur, identifiantsProjet, invitéPar } = payload;

        const projects = await Promise.all(
          identifiantsProjet.map(async (identifiantProjet) =>
            getLegacyProjetByIdentifiantProjet(
              IdentifiantProjet.convertirEnValueType(identifiantProjet),
            ),
          ),
        );

        const userId = await getOrCreateUser(identifiantUtilisateur, 'porteur-projet');

        const invitéParUserId = await getUserIdByEmail(invitéPar);

        await eventStore.publish(
          new UserInvitedToProject({
            payload: {
              userId: userId,
              projectIds: projects.map((project) => project?.id).filter(Boolean) as string[],
              invitedBy: invitéParUserId,
            },
          }),
        );

        break;
      }
      case 'ProjetRéclamé-V1': {
        const { identifiantProjet, identifiantUtilisateur } = payload;

        const userId = await getOrCreateUser(identifiantUtilisateur, 'porteur-projet');

        const project = await getLegacyProjetByIdentifiantProjet(
          IdentifiantProjet.convertirEnValueType(identifiantProjet),
        );

        if (!project) {
          logger.warning('Project not found', { event, context: 'Legacy Utilisateur Saga' });
          break;
        }

        await eventStore.publish(
          new ProjectClaimedByOwner({
            payload: {
              claimedBy: userId,
              claimerEmail: identifiantUtilisateur,
              projectId: project.id,
            },
          }),
        );

        break;
      }
      case 'AccèsProjetRetiré-V1': {
        const { identifiantProjet, identifiantUtilisateur, retiréPar, cause } = payload;
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
        break;
      }
      case 'UtilisateurInvité-V1': {
        const { identifiantUtilisateur, rôle, invitéPar } = payload;

        const invitéParUserId = await getUserIdByEmail(invitéPar);
        const userId = await getOrCreateUser(identifiantUtilisateur, rôle);

        await eventStore.publish(
          new UtilisateurInvité({
            payload: {
              email: identifiantUtilisateur,
              ...(rôle === 'dgec-validateur' ? { role: rôle, fonction: '' } : { role: rôle }),
            },
          }),
        );

        if (rôle === 'dreal') {
          await eventStore.publish(
            new DrealUserInvited({
              payload: {
                userId,
                region: payload.région as Région,
                invitedBy: invitéParUserId,
              },
            }),
          );
        }

        break;
      }
    }
  };

  mediator.register('System.Saga.Utilisateur', handler);
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
