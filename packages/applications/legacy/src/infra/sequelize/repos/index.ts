import { eventStore } from '../../../config/eventStore.config';
import { fileStorageService } from '../../../config/fileStorage.config';
import { buildProjectIdentifier } from '../../../config/crypto.config';
import { makeUser } from '../../../modules/users';
import { makeFileRepo } from './fileRepo';
import { makeModificationRequestRepo } from './modificationRequestRepo';
import { NotificationRepo } from './notificationRepo';
import { makeProjectRepo } from './projectRepo';
import { makeProjectClaimRepo } from './projectClaimRepo';
import { makeLegacyCandidateNotification } from '../../../modules/legacyCandidateNotification';
import { makeEventStoreRepo, makeEventStoreTransactionalRepo } from '../../../core/utils';
import { makeDemandeDélai } from '../../../modules/demandeModification';
import { makeUtilisateur } from '../../../modules/utilisateur';

export const fileRepo = makeFileRepo({ fileStorageService });
export const notificationRepo = new NotificationRepo();
export const legacyCandidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeLegacyCandidateNotification,
});
export const projectRepo = makeProjectRepo(eventStore, buildProjectIdentifier);
export const projectClaimRepo = makeProjectClaimRepo(eventStore);
export const modificationRequestRepo = makeModificationRequestRepo(eventStore);
export const userRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeUser,
});
export const demandeDélaiRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeDemandeDélai,
  }),
  ...makeEventStoreRepo({
    eventStore,
    makeAggregate: makeDemandeDélai,
  }),
};

export const utilisateurRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeUtilisateur,
  }),
};
