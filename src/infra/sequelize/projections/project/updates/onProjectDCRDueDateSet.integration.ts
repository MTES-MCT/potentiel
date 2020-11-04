import { ProjectDCRDueDateSet } from '../../../../../modules/project/events'
import { sequelize } from '../../../../../sequelize.config'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet'

describe('project.onProjectDCRDueDateSet', () => {
  const fakeProjects = [
    {
      id: 'target',
      dcrDueOn: 0,
    },
    {
      id: 'nottarget',
      dcrDueOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.dcrDueOn', async () => {
    await onProjectDCRDueDateSet(models)(
      new ProjectDCRDueDateSet({
        payload: {
          projectId: 'target',
          dcrDueOn: 12345,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    expect(updatedProject.dcrDueOn).toEqual(12345)

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.dcrDueOn).toEqual(0)
  })
})
