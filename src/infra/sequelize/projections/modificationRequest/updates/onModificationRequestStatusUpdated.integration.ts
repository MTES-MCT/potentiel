import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onModificationRequestStatusUpdated } from './onModificationRequestStatusUpdated'
import { ModificationRequestStatusUpdated } from '@modules/modificationRequest'
import { UniqueEntityID } from '@core/domain'

describe('modificationRequest.onModificationRequestStatusUpdated', () => {
  const ModificationRequestModel = models.ModificationRequest

  const modificationRequestId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'recours',
      status: 'envoyée',
      requestedOn: 1,
      requestedBy: userId,
    })
  })

  it('should update status', async () => {
    await onModificationRequestStatusUpdated(models)(
      new ModificationRequestStatusUpdated({
        payload: {
          modificationRequestId,
          updatedBy: userId,
          newStatus: 'acceptée',
        },
        original: {
          occurredAt: new Date(123),
          version: 1,
        },
      })
    )

    const updatedModificationRequest = await ModificationRequestModel.findByPk(
      modificationRequestId
    )
    expect(updatedModificationRequest.status).toEqual('acceptée')
    expect(updatedModificationRequest.respondedBy).toEqual(userId)
    expect(updatedModificationRequest.respondedOn).toEqual(123)
  })
})
