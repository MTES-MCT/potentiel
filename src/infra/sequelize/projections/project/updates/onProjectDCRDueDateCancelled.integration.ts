import { resetDatabase } from '../../../helpers'
import { ProjectDCRDueDateCancelled } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectDCRDueDateCancelled } from './onProjectDCRDueDateCancelled'
import { v4 as uuid } from 'uuid'

const { Project } = models

describe('project.onProjectDCRDueDateCancelled', () => {
  const projectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      dcrDueOn: new Date('2020-01-01').getTime(),
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
  })
})
