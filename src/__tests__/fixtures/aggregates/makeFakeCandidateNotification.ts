import { UniqueEntityID } from '../../../core/domain'
import { StoredEvent } from '../../../modules/eventStore'

export const makeFakeCandidateNotification = () => ({
  notifyCandidateIfReady: jest.fn(),
  lastUpdatedOn: new Date(0),
  pendingEvents: [] as StoredEvent[],
  id: new UniqueEntityID(),
})
