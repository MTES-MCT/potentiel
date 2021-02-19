import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectPTFSubmitted } from '../../../../../modules/project/events'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectPTFSubmitted } from './onProjectPTFSubmitted'

describe('projectPTF.onProjectPTFSubmitted', () => {
  const { ProjectStep } = models

  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const ptfDate = new Date(123)

  beforeEach(async () => {
    // Create the tables and remove all data
    await resetDatabase()
  })

  it('should create a new projectPTF', async () => {
    const event = new ProjectPTFSubmitted({
      payload: {
        projectId,
        ptfDate,
        fileId,
        submittedBy: userId,
      },
    })
    await onProjectPTFSubmitted(models)(event)

    const projection = await ProjectStep.findByPk(projectId)

    expect(projection).toBeDefined()
    if (!projection) return

    expect(projection.get()).toEqual(
      expect.objectContaining({
        type: 'ptf',
        projectId,
        stepDate: ptfDate,
        fileId,
        submittedById: userId,
      })
    )
  })
})
