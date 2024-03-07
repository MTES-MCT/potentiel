import { ok } from 'neverthrow';
import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { jest } from '@jest/globals';

export const makeFakeModificationRequest = () => ({
  accept: jest.fn(() => ok<null, never>(null)),
  reject: jest.fn(() => ok<null, never>(null)),
  cancel: jest.fn(() => ok<null, never>(null)),
  updateStatus: jest.fn(() => ok<null, never>(null)),
  requestConfirmation: jest.fn(() => ok<null, never>(null)),
  confirm: jest.fn(() => ok<null, never>(null)),
  projectId: new UniqueEntityID(),
  pendingEvents: [] as DomainEvent[],
  lastUpdatedOn: new Date(0),
  id: new UniqueEntityID(),
  status: 'envoyée',
  type: 'delai',
});
