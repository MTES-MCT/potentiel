import { UniqueEntityID } from '../../../../../core/domain'
import { describeProjector } from '../../../__tests__/projections'
import models from '../../../models'
import { onModificationRequestCancelled } from './onModificationRequestCancelled'
import { ModificationRequestCancelled } from '../../../../../modules/modificationRequest/events'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'

const { ModificationRequest } = models

const modificationRequestId = new UniqueEntityID().toString()
const userId = new UniqueEntityID().toString()

const fakeItem = makeFakeModificationRequest({ id: modificationRequestId, status: 'envoyée' })

describeProjector(onModificationRequestCancelled)
  .onEvent(
    new ModificationRequestCancelled({
      payload: {
        modificationRequestId,
        cancelledBy: userId,
      },
      original: {
        occurredAt: new Date(123),
      },
    })
  )
  .shouldUpdate({
    model: ModificationRequest,
    id: modificationRequestId,
    before: fakeItem,
    after: {
      ...fakeItem,
      status: 'annulée',
      cancelledOn: 123,
      cancelledBy: userId,
    },
  })
