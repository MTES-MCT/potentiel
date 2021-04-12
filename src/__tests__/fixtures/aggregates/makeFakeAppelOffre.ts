import { ok } from '../../../core/utils'
import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { UnauthorizedError } from '../../../modules/shared'

export const makeFakeAppelOffre = () => ({
  update: jest.fn(() => ok<null, UnauthorizedError>(null)),
  updatePeriode: jest.fn(() => ok<null, UnauthorizedError>(null)),
  lastUpdatedOn: new Date(0),
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(),
})
