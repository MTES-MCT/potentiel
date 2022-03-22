import { resetDatabase } from '../../../helpers'
import { ProjectCompletionDueDateCancelled } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectCompletionDueDateCancelled } from './onProjectCompletionDueDateCancelled'
import { v4 as uuid } from 'uuid'

const { Project } = models

describe('project.onProjectCompletionDueDateCancelled', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      completionDueOn: new Date('2020-01-01').getTime(),
    },
    {
      id: fakeProjectId,
      completionDueOn: 123456,
    },
  ].map(makeFakeProject)

  beforeAll(async () => {
    await resetDatabase()
    await Project.bulkCreate(fakeProjects)
  })

  it('should update project.completionDueOn', async () => {
    await onProjectCompletionDueDateCancelled(models)(
      new ProjectCompletionDueDateCancelled({
        payload: {
          projectId,
        },
      })
    )

    const updatedProject = await Project.findByPk(projectId)
    expect(updatedProject.completionDueOn).toEqual(0)

    const nonUpdatedProject = await Project.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.completionDueOn).toEqual(123456)
  })
})
