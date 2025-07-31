import { eventStore } from '../../../config/eventStore.config';
import { fileStorageService } from '../../../config/fileStorage.config';
import { buildProjectIdentifier } from '../../../config/crypto.config';
import { makeUser } from '../../../modules/users';
import { makeFileRepo } from './fileRepo';
import { makeModificationRequestRepo } from './modificationRequestRepo';
import { NotificationRepo } from './notificationRepo';
import { makeProjectRepo } from './projectRepo';
import { makeLegacyCandidateNotification } from '../../../modules/legacyCandidateNotification';
import { makeEventStoreTransactionalRepo } from '../../../core/utils';
import { makeUtilisateur } from '../../../modules/utilisateur';

export const fileRepo = makeFileRepo({ fileStorageService });
export const notificationRepo = new NotificationRepo();
export const legacyCandidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeLegacyCandidateNotification,
});
export const projectRepo = makeProjectRepo(eventStore, buildProjectIdentifier);
export const modificationRequestRepo = makeModificationRequestRepo(eventStore);
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
