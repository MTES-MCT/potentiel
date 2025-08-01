import { eventStore } from '../../../config/eventStore.config';
import { buildProjectIdentifier } from '../../../config/crypto.config';
import { makeUser } from '../../../modules/users';
import { makeProjectRepo } from './projectRepo';
import { makeEventStoreTransactionalRepo } from '../../../core/utils';
import { makeUtilisateur } from '../../../modules/utilisateur';

export const projectRepo = makeProjectRepo(eventStore, buildProjectIdentifier);
export const userRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeUser,
});

export const utilisateurRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeUtilisateur,
  }),
};
