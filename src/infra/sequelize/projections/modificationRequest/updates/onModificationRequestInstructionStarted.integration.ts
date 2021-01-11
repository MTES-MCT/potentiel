import models from '../../../models'
import { sequelize } from '../../../../../sequelize.config'
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted'
import { ModificationRequestInstructionStarted } from '../../../../../modules/modificationRequest/events'
import { UniqueEntityID } from '../../../../../core/domain'

describe('modificationRequest.onModificationRequestInstructionStarted', () => {
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
      requestedBy: userId,
    })
  })

  it('should update status to en instruction', async () => {
    await onModificationRequestInstructionStarted(models)(
      new ModificationRequestInstructionStarted({
        payload: {
          modificationRequestId,
        },
      })
    )

    const updatedModificationRequest = await ModificationRequestModel.findByPk(
      modificationRequestId
    )
    expect(updatedModificationRequest.status).toEqual('en instruction')
  })
})
