import { UniqueEntityID } from '@core/domain'
import { ModificationReceived } from '@modules/modificationRequest'
import models from '../../../models'
import { onModificationReceived } from './onModificationReceived'

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
          authority: 'dgec',
        },
      })
    )

    const {
      puissance,
      type,
      projectId: receivedProjectId,
      userId: receivedUserId,
      status,
      authority,
    } = await ModificationRequestModel.findByPk(modificationRequestId)

    expect(puissance).toEqual(104)
    expect(type).toEqual('puissance')
    expect(receivedProjectId).toEqual(projectId)
    expect(receivedUserId).toEqual(userId)
    expect(authority).toEqual('dgec')
    expect(status).toEqual('information validée')
  })
})
