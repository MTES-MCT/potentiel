import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onCovidDelayGranted } from './onCovidDelayGranted'
import { CovidDelayGranted } from '@modules/project'
import { v4 as uuid } from 'uuid'

describe('project.onCovidDelayGranted', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
  const project = makeFakeProject({ id: projectId, notifiedOn: 123 })

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
    await ProjectModel.bulkCreate([project])
  })

  it('should update the project completion due date', async () => {
    const newCompletionDueOn = 456

    await onCovidDelayGranted(models)(
      new CovidDelayGranted({
        payload: { projectId, completionDueOn: newCompletionDueOn },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.completionDueOn).toEqual(newCompletionDueOn)
  })
})
