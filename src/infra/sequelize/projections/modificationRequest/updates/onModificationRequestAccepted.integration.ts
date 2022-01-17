import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onModificationRequestAccepted } from './onModificationRequestAccepted'
import { ModificationRequestAccepted } from '@modules/modificationRequest'
import { UniqueEntityID } from '../../../../../core/domain'

describe('modificationRequest.onModificationRequestAccepted', () => {
  const ModificationRequestModel = models.ModificationRequest

  const modificationRequestId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const responseFileId = new UniqueEntityID().toString()

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

  it('should update status to accepté and insert acceptance params', async () => {
    const fakeAcceptanceParams = {
      param1: 'value1',
    }
    await onModificationRequestAccepted(models)(
      new ModificationRequestAccepted({
        payload: {
          modificationRequestId,
          acceptedBy: userId,
          responseFileId,
          params: fakeAcceptanceParams,
        },
      })
    )

    const updatedModificationRequest = await ModificationRequestModel.findByPk(
      modificationRequestId
    )
    expect(updatedModificationRequest.status).toEqual('acceptée')
    expect(updatedModificationRequest.responseFileId).toEqual(responseFileId)
    expect(updatedModificationRequest.acceptanceParams).toEqual(fakeAcceptanceParams)
  })
})
