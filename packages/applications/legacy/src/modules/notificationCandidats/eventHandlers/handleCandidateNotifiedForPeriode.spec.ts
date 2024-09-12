import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { UniqueEntityID } from '../../../core/domain';
import { okAsync } from '../../../core/utils';
import { User } from '../../../entities';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { makeFakeCreateUser } from '../../../__tests__/fakes';
import { InfraNotAvailableError } from '../../shared';
import { CandidateNotifiedForPeriode } from '../events';
import { handleCandidateNotifiedForPeriode } from './handleCandidateNotifiedForPeriode';

const fakePayload = {
  periodeId: 'periode1',
  appelOffreId: 'appelOffre1',
  candidateEmail: 'email1@test.test',
  candidateName: 'name',
};

describe('handleCandidateNotifiedForPeriode', () => {
  describe('if user exists', () => {
    const userWithEmail: User = makeFakeUser({ id: new UniqueEntityID().toString() });
    const getUserByEmail = jest.fn((email: string) =>
      okAsync<User | null, InfraNotAvailableError>(userWithEmail),
    );

    const createUser = makeFakeCreateUser();

    beforeAll(async () => {
      await handleCandidateNotifiedForPeriode({
        getUserByEmail,
        createUser,
      })(
        new CandidateNotifiedForPeriode({
          payload: { ...fakePayload },
          requestId: 'request1',
        }),
      );
    });

    it('should send a designation notification to the candidate', () => {
      expect(createUser).not.toHaveBeenCalled();
    });
  });

  describe('if user does not exist', () => {
    const getUserByEmail = jest.fn((email: string) =>
      okAsync<User | null, InfraNotAvailableError>(null),
    );

    const createUser = makeFakeCreateUser();

    beforeAll(async () => {
      await handleCandidateNotifiedForPeriode({
        getUserByEmail,
        createUser,
      })(
        new CandidateNotifiedForPeriode({
          payload: { ...fakePayload },
          requestId: 'request1',
        }),
      );
    });

    it('create a new account for the candidate', () => {
      expect(createUser).toHaveBeenCalledWith({
        role: 'porteur-projet',
        email: fakePayload.candidateEmail,
        fullName: fakePayload.candidateName,
      });
    });
  });
});
