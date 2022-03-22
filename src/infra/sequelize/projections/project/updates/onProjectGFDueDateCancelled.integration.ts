import { resetDatabase } from '../../../helpers'
import { ProjectGFDueDateCancelled } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectGFDueDateCancelled } from './onProjectGFDueDateCancelled'
import { v4 as uuid } from 'uuid'

const { Project } = models

describe('project.onProjectGFDueDateCancelled', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      garantiesFinancieresDueOn: new Date('2020-01-01').getTime(),
    },
    {
      id: fakeProjectId,
      garantiesFinancieresDueOn: 123456,
    },
  ].map(makeFakeProject)

  beforeAll(async () => {
    await resetDatabase()
    await Project.bulkCreate(fakeProjects)
  })

  it('should update project.garantiesFinancieresDueOn', async () => {
    await onProjectGFDueDateCancelled(models)(
      new ProjectGFDueDateCancelled({
        payload: {
          projectId,
        },
      })
    )

    const updatedProject = await Project.findByPk(projectId)
    expect(updatedProject.garantiesFinancieresDueOn).toEqual(0)

    const nonUpdatedProject = await Project.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.garantiesFinancieresDueOn).toEqual(123456)
  })
})
