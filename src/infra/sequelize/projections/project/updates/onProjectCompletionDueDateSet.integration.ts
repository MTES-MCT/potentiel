import { resetDatabase } from '../../../helpers'
import { ProjectCompletionDueDateSet } from '../../../../../modules/project/events'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectCompletionDueDateSet } from './onProjectCompletionDueDateSet'
import { v4 as uuid } from 'uuid'

describe('project.onProjectCompletionDueDateSet', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      completionDueOn: 0,
    },
    {
      id: fakeProjectId,
      completionDueOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    await resetDatabase()
    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.completionDueOn', async () => {
    await onProjectCompletionDueDateSet(models)(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId,
          completionDueOn: 12345,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.completionDueOn).toEqual(12345)

    const nonUpdatedProject = await ProjectModel.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.completionDueOn).toEqual(0)
  })
})
