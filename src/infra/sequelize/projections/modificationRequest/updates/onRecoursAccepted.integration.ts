import models from '../../../models'
import { sequelize } from '../../../../../sequelize.config'
import { onRecoursAccepted } from './onRecoursAccepted'
import { RecoursAccepted } from '../../../../../modules/modificationRequest/events'
import { UniqueEntityID } from '../../../../../core/domain'

describe('modificationRequest.onRecoursAccepted', () => {
  const ModificationRequestModel = models.ModificationRequest

  const modificationRequestId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'recours',
      status: 'envoyée',
      requestedOn: 1,
    })
  })

  it('should update status to accepté', async () => {
    await onRecoursAccepted(models)(
      new RecoursAccepted({
        payload: {
          modificationRequestId,
          acceptedBy: userId,
        },
      })
    )

    const updatedModificationRequest = await ModificationRequestModel.findByPk(
      modificationRequestId
    )
    expect(updatedModificationRequest.status).toEqual('accepté')
  })
})
