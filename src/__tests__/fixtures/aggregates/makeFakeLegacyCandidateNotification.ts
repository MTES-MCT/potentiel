import { ok } from 'neverthrow';
import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { jest } from '@jest/globals';

export const makeFakeLegacyCandidateNotification = () => ({
  notify: jest.fn(() => ok<null, never>(null)),
  lastUpdatedOn: new Date(0),
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(),
});
