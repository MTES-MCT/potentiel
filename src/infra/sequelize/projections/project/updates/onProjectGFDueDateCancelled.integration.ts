import { resetDatabase } from '../../../helpers'
import { ProjectGFDueDateCancelled } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectGFDueDateCancelled } from './onProjectGFDueDateCancelled'
import { v4 as uuid } from 'uuid'

const { Project } = models

describe('project.onProjectGFDueDateCancelled', () => {
  const projectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      garantiesFinancieresDueOn: new Date('2020-01-01').getTime(),
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
  })
})
