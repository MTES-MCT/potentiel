import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../core/domain';
import { makeUser } from '../../entities';
import makeFakeUser from '../../__tests__/fixtures/user';
import {
  ModificationRequestAccepted,
  ModificationRequested,
} from './events';
import { StatusPreventsConfirmationError } from './errors';
import { makeModificationRequest } from './ModificationRequest';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import { UnwrapForTest } from '../../core/utils';

describe('Modification.confirm()', () => {
  const modificationRequestId = new UniqueEntityID();
  const projectId = new UniqueEntityID();
  const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));
  const fakeResponseFileId = new UniqueEntityID().toString();

  describe('when demande status is not en attente de confirmation', () => {
    const fakeModificationRequest = UnwrapForTest(
      makeModificationRequest({
        modificationRequestId,
        history: [
          new ModificationRequested({
            payload: {
              modificationRequestId: modificationRequestId.toString(),
              projectId: projectId.toString(),
              type: 'recours',
              requestedBy: fakeUser.id,
              authority: 'dgec',
            },
          }),
          new ModificationRequestAccepted({
            payload: {
              modificationRequestId: modificationRequestId.toString(),
              acceptedBy: fakeUser.id,
              responseFileId: '',
            },
          }),
        ],
      }),
    );

    it('should return StatusPreventsConfirmationError', () => {
      expect(fakeModificationRequest.status).toEqual('acceptée');

      const res = fakeModificationRequest.confirm(fakeUser);
      expect(res.isErr()).toBe(true);
      if (res.isOk()) return;

      expect(res.error).toBeInstanceOf(StatusPreventsConfirmationError);
    });
  });
});
