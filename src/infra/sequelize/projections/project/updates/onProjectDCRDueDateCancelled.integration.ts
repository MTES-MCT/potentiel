import { resetDatabase } from '../../../helpers'
import { ProjectDCRDueDateCancelled } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectDCRDueDateCancelled } from './onProjectDCRDueDateCancelled'
import { v4 as uuid } from 'uuid'

const { Project } = models

describe('project.onProjectDCRDueDateCancelled', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      dcrDueOn: new Date('2020-01-01').getTime(),
    },
    {
      id: fakeProjectId,
      dcrDueOn: 123456,
    },
  ].map(makeFakeProject)

  beforeAll(async () => {
    await resetDatabase()
    await Project.bulkCreate(fakeProjects)
  })

  it('should update project.dcrDueOn', async () => {
    await onProjectDCRDueDateCancelled(models)(
      new ProjectDCRDueDateCancelled({
        payload: {
          projectId,
        },
      })
    )

    const updatedProject = await Project.findByPk(projectId)
    expect(updatedProject.dcrDueOn).toEqual(0)

    const nonUpdatedProject = await Project.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.dcrDueOn).toEqual(123456)
  })
})
