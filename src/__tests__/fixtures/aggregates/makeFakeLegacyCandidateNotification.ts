import { DomainEvent, UniqueEntityID } from '../../../core/domain'

export const makeFakeLegacyCandidateNotification = () => ({
  notify: jest.fn(),
  lastUpdatedOn: new Date(0),
  pendingEvents: [] as DomainEvent[],
  id: new UniqueEntityID(),
})
