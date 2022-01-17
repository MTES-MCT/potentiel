import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onModificationRequestRejected } from './onModificationRequestRejected'
import { ModificationRequestRejected } from '@modules/modificationRequest'
import { UniqueEntityID } from '../../../../../core/domain'

describe('modificationRequest.onModificationRequestRejected', () => {
  const ModificationRequestModel = models.ModificationRequest

  const modificationRequestId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()

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

  it('should update status to rejetée and add response file', async () => {
    await onModificationRequestRejected(models)(
      new ModificationRequestRejected({
        payload: {
          modificationRequestId,
          rejectedBy: userId,
          responseFileId: fileId,
        },
      })
    )

    const updatedModificationRequest = await ModificationRequestModel.findByPk(
      modificationRequestId
    )
    expect(updatedModificationRequest.status).toEqual('rejetée')
    expect(updatedModificationRequest.responseFileId).toEqual(fileId)
  })
})
