import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onModificationReceived } from './onModificationReceived'
import { ModificationReceived } from '../../../../../modules/modificationRequest/events'
import { UniqueEntityID } from '../../../../../core/domain'

describe('modificationRequest.onModificationReceived', () => {
  const ModificationRequestModel = models.ModificationRequest

  const modificationRequestId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  it('should create a Modification Request with a status of information validée', async () => {
    await onModificationReceived(models)(
      new ModificationReceived({
        payload: {
          modificationRequestId,
          type: 'puissance',
          projectId,
          requestedBy: userId,
          puissance: 104,
        },
      })
    )

    const updatedModificationRequest = await ModificationRequestModel.findByPk(
      modificationRequestId
    )

    expect(updatedModificationRequest.status).toEqual('information validée')
  })
})
