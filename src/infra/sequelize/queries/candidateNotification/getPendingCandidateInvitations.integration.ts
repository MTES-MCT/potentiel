import { beforeAll, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { getPendingCandidateInvitations } from './getPendingCandidateInvitations';
import { User, Project } from '@infra/sequelize/projectionsNext';

describe('getPendingCandidateInvitations()', () => {
  const pendingCandidateId = new UniqueEntityID().toString();
  const pendingNonCandidateId = new UniqueEntityID().toString();

  describe('without an appelOffre or periodeId', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase();

      await User.bulkCreate([
        makeFakeUser({
          id: pendingCandidateId,
          email: 'pending@test.test',
          fullName: 'pending user',
          registeredOn: null,
          createdAt: new Date(345),
        }),
        makeFakeUser({
          id: pendingNonCandidateId,
          email: 'pendingNotCandidate@test.test',
          fullName: 'pending non candidate',
          registeredOn: null,
        }),
        makeFakeUser({
          id: new UniqueEntityID().toString(),
          registeredOn: new Date(123),
        }),
      ]);

      await Project.create(
        makeFakeProject({
          email: 'pending@test.test',
        }),
      );
    });

    it('return a paginated list of users that are not yet registered and is the candidate of at least one project', async () => {
      try {
        const pendingInvitations = (
          await getPendingCandidateInvitations({ pageSize: 10, page: 0 })
        )._unsafeUnwrap();

        expect(pendingInvitations.itemCount).toEqual(1);
        expect(pendingInvitations.pageCount).toEqual(1);
        expect(pendingInvitations.items[0]).toMatchObject({
          email: 'pending@test.test',
          fullName: 'pending user',
          invitedOn: 345,
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
});
