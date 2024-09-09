import { logger, okAsync } from '../../../core/utils';
import { GetUserByEmail, CreateUser } from '../../users';
import { CandidateNotifiedForPeriode } from '../events/CandidateNotifiedForPeriode';

export const handleCandidateNotifiedForPeriode =
  (deps: { createUser: CreateUser; getUserByEmail: GetUserByEmail }) =>
  async (event: CandidateNotifiedForPeriode) => {
    const { createUser, getUserByEmail } = deps;
    const {
      payload: { periodeId, appelOffreId, candidateEmail, candidateName },
    } = event;

    await getUserByEmail(candidateEmail)
      .andThen((userOrNull) => {
        if (userOrNull === null) {
          return createUser({
            role: 'porteur-projet',
            email: candidateEmail,
            fullName: candidateName,
          });
        }

        return okAsync(null);
      })
      .match(
        () => {},
        (e) => {
          logger.info(`Failed to notify candidate for periode ${appelOffreId} - ${periodeId}`);
          logger.error(e);
        },
      );
  };
