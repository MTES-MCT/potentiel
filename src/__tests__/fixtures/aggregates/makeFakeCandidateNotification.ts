import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { jest } from '@jest/globals';

export const makeFakeCandidateNotification = () => ({
  notifyCandidateIfReady: jest.fn(),
  lastUpdatedOn: new Date(0),
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(),
});
