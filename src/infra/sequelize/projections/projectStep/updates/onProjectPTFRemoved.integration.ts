import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectPTFRemoved } from '../../../../../modules/project/events'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onProjectPTFRemoved } from './onProjectPTFRemoved'

describe('projectPTF.onProjectPTFRemoved', () => {
  const { ProjectStep } = models

  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await ProjectStep.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ptf',
      stepDate: new Date(123),
      fileId: new UniqueEntityID().toString(),
      submittedBy: new UniqueEntityID().toString(),
      submittedOn: new Date(1234),
    })

    expect(await ProjectStep.count({ where: { projectId, type: 'ptf' } })).toEqual(1)
  })

  it('should remove the project ptf step', async () => {
    const event = new ProjectPTFRemoved({
      payload: {
        projectId,
        removedBy: new UniqueEntityID().toString(),
      },
    })
    await onProjectPTFRemoved(models)(event)

    expect(await ProjectStep.count({ where: { projectId, type: 'ptf' } })).toEqual(0)
  })
})
