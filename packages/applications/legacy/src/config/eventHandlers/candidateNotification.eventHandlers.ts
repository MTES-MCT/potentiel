import {
  CandidateNotifiedForPeriode,
  handleCandidateNotifiedForPeriode,
} from '../../modules/notificationCandidats';

import { eventStore } from '../eventStore.config';
import { getUserByEmail } from '../queries.config';
import { createUser } from '../useCases.config';

eventStore.subscribe(
  CandidateNotifiedForPeriode.type,
  handleCandidateNotifiedForPeriode({
    createUser,
    getUserByEmail,
  }),
);
