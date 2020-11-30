import { ok } from 'neverthrow'
import { UniqueEntityID } from '../../../core/domain'
import { StoredEvent } from '../../../modules/eventStore'

export const makeFakeModificationRequest = () => ({
  acceptRecours: jest.fn(() => ok<null, never>(null)),
  projectId: new UniqueEntityID(),
  pendingEvents: [] as StoredEvent[],
  lastUpdatedOn: new Date(0),
  id: new UniqueEntityID(),
})
