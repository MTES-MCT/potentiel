import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { ok } from '../../../core/utils'
import { EntityNotFoundError } from '@modules/shared'

export const makeFakeUser = () => ({
  registerFirstLogin: jest.fn(() => ok<null, never>(null)),
  getUserId: jest.fn(() => ok<string, EntityNotFoundError>('userId')),
  create: jest.fn(() => ok<null, never>(null)),
  lastUpdatedOn: new Date(0),
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(),
})
