import { ProjectGFDueDateSet } from '../../../../modules/project/events'
import { sequelize } from '../../../../sequelize.config'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import models from '../../models'
import { onProjectGFDueDateSet } from './onProjectGFDueDateSet'

describe('project.onProjectGFDueDateSet', () => {
  const fakeProjects = [
    {
      id: 'target',
      garantiesFinancieresDueOn: 0,
    },
    {
      id: 'nottarget',
      garantiesFinancieresDueOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.garantiesFinancieresDueOn', async () => {
    await onProjectGFDueDateSet(models)(
      new ProjectGFDueDateSet({
        payload: {
          projectId: 'target',
          garantiesFinancieresDueOn: 12345,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    expect(updatedProject.garantiesFinancieresDueOn).toEqual(12345)

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.garantiesFinancieresDueOn).toEqual(0)
  })
})
