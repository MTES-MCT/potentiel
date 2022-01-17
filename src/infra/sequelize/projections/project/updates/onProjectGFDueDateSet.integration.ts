import { resetDatabase } from '../../../helpers'
import { ProjectGFDueDateSet } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectGFDueDateSet } from './onProjectGFDueDateSet'
import { v4 as uuid } from 'uuid'

describe('project.onProjectGFDueDateSet', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      garantiesFinancieresDueOn: 0,
    },
    {
      id: fakeProjectId,
      garantiesFinancieresDueOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    await resetDatabase()
    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.garantiesFinancieresDueOn', async () => {
    await onProjectGFDueDateSet(models)(
      new ProjectGFDueDateSet({
        payload: {
          projectId,
          garantiesFinancieresDueOn: 12345,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.garantiesFinancieresDueOn).toEqual(12345)

    const nonUpdatedProject = await ProjectModel.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.garantiesFinancieresDueOn).toEqual(0)
  })
})
