import { eventStore } from '@config/eventStore.config';
import { fileStorageService } from '@config/fileStorage.config';
import { buildProjectIdentifier } from '@config/crypto.config';
import { makeCandidateNotification } from '@modules/notificationCandidats';
import { makeUser } from '@modules/users';
import { makeFileRepo } from './fileRepo';
import { makeModificationRequestRepo } from './modificationRequestRepo';
import { NotificationRepo } from './notificationRepo';
import { makeProjectRepo } from './projectRepo';
import { makeProjectClaimRepo } from './projectClaimRepo';
import { makeLegacyCandidateNotification } from '@modules/legacyCandidateNotification';
import { makeEventStoreRepo, makeEventStoreTransactionalRepo } from '@core/utils';
import {
  makeDemandeDélai,
  makeDemandeAbandon,
  makeDemandeAnnulationAbandon,
} from '@modules/demandeModification';
import { makeUtilisateur } from '@modules/utilisateur';

export const fileRepo = makeFileRepo({ fileStorageService });
export const notificationRepo = new NotificationRepo();
export const candidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeCandidateNotification,
});
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

export const demandeAbandonRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeDemandeAbandon,
  }),
  ...makeEventStoreRepo({
    eventStore,
    makeAggregate: makeDemandeAbandon,
  }),
};

export const demandeAnnulationAbandonRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeDemandeAnnulationAbandon,
  }),
  ...makeEventStoreRepo({
    eventStore,
    makeAggregate: makeDemandeAnnulationAbandon,
  }),
};

export const utilisateurRepo = {
  ...makeEventStoreTransactionalRepo({
    eventStore,
    makeAggregate: makeUtilisateur,
  }),
};
