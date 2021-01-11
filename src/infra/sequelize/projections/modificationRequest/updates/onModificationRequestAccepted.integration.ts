import models from '../../../models'
import { sequelizeInstance } from '../../../../../sequelize.config'
import { onModificationRequestAccepted } from './onModificationRequestAccepted'
import { ModificationRequestAccepted } from '../../../../../modules/modificationRequest/events'
import { UniqueEntityID } from '../../../../../core/domain'

describe('modificationRequest.onModificationRequestAccepted', () => {
  const ModificationRequestModel = models.ModificationRequest

  const modificationRequestId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelizeInstance.sync({ force: true })

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

  it('should update status to accepté', async () => {
    await onModificationRequestAccepted(models)(
      new ModificationRequestAccepted({
        payload: {
          modificationRequestId,
          acceptedBy: userId,
        },
      })
    )

    const updatedModificationRequest = await ModificationRequestModel.findByPk(
      modificationRequestId
    )
    expect(updatedModificationRequest.status).toEqual('acceptée')
  })
})
