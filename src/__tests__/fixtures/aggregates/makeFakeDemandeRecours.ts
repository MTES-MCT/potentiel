import { ok } from 'neverthrow'

import { UniqueEntityID, DomainEvent } from '@core/domain'
import { ModificationRequestStatus } from '@modules/modificationRequest'

export const makeFakeDemandeRecours = (overide?: {
  id?: UniqueEntityID
  status?: ModificationRequestStatus
  projectId?: string
  pendingEvents?: DomainEvent[]
  lastUpdatedOn?: Date
}) => ({
  accept: jest.fn(() => ok<null, never>(null)),
  reject: jest.fn(() => ok<null, never>(null)),
  cancel: jest.fn(() => ok<null, never>(null)),
  updateStatus: jest.fn(() => ok<null, never>(null)),
  requestConfirmation: jest.fn(() => ok<null, never>(null)),
  confirm: jest.fn(() => ok<null, never>(null)),
  projectId: overide?.projectId || new UniqueEntityID(),
  pendingEvents: overide?.pendingEvents || ([] as DomainEvent[]),
  lastUpdatedOn: overide?.lastUpdatedOn || new Date(0),
  id: overide?.id || new UniqueEntityID(),
  status: overide?.status || 'envoyée',
  type: 'recours',
})
