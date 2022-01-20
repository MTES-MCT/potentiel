import { resetDatabase } from '../../../helpers'
import { ProjectDCRDueDateSet } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet'
import { v4 as uuid } from 'uuid'

describe('project.onProjectDCRDueDateSet', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      dcrDueOn: 0,
    },
    {
      id: fakeProjectId,
      dcrDueOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    await resetDatabase()
    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.dcrDueOn', async () => {
    await onProjectDCRDueDateSet(models)(
      new ProjectDCRDueDateSet({
        payload: {
          projectId: projectId,
          dcrDueOn: 12345,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.dcrDueOn).toEqual(12345)

    const nonUpdatedProject = await ProjectModel.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.dcrDueOn).toEqual(0)
  })
})
