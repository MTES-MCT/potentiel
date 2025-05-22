import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { ok } from '../core/utils';
import { eventStore } from '../config/eventStore.config';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';
import { Role, UtilisateurEvent } from '@potentiel-domain/utilisateur';
import { DrealUserInvited, UserInvitedToProject } from '../modules/authZ';
import { createUser } from '../config';
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

        const projectIds: string[] = [];
        for (const identifiantProjet of identifiantsProjet) {
          const project = await getLegacyProjetByIdentifiantProjet(
            IdentifiantProjet.convertirEnValueType(identifiantProjet),
          );
          if (project) {
            projectIds.push(project.id);
          }
        }

        const userId = await getOrCreateUser(identifiantUtilisateur, 'porteur-projet');

        const invitéParUserId = await getUserIdByEmail(invitéPar);

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
