import { Role, UtilisateurEvent } from '@potentiel-domain/utilisateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Message, MessageHandler, mediator } from 'mediateur';
import { createUser } from '../config';
import { eventStore } from '../config/eventStore.config';
import { ok } from '../core/utils';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';
import { DrealUserInvited } from '../modules/authZ';
import { Région } from '../modules/dreal/région';
import { UtilisateurInvité } from '../modules/utilisateur';

export type SubscriptionEvent = UtilisateurEvent & Event;

export type Execute = Message<'System.Saga.Utilisateur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    switch (type) {
      case 'UtilisateurInvité-V2': {
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
