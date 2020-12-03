import { UniqueEntityID } from '../../../../../core/domain'
import { ModificationRequested } from '../../../../../modules/modificationRequest'
import { sequelize } from '../../../../../sequelize.config'
import models from '../../../models'
import { onModificationRequested } from './onModificationRequested'

describe('modificationRequest.onModificationRequested', () => {
  const ModificationRequestModel = models.ModificationRequest

  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()

  beforeEach(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })
  })

  it('should create a new modificationRequest', async () => {
    const modificationRequestId = new UniqueEntityID().toString()

    const event = new ModificationRequested({
      payload: {
        type: 'recours',
        projectId,
        modificationRequestId,
        fileId,
        justification: 'justification',
        requestedBy: userId,
      },
    })
    await onModificationRequested(models)(event)

    const projection = await ModificationRequestModel.findByPk(modificationRequestId)

    expect(projection).toBeDefined()
    if (!projection) return

    expect(projection.get()).toEqual(
      expect.objectContaining({
        id: modificationRequestId,
        projectId,
        type: 'recours',
        requestedOn: event.occurredAt.getTime(),
        status: 'envoyée',
        fileId: event.payload.fileId,
        justification: event.payload.justification,
        userId: event.payload.requestedBy,
      })
    )
  })
})
