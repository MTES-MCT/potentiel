import models from '../../../models'
import { sequelize } from '../../../../../sequelize.config'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onProjectClasseGranted } from './onProjectClasseGranted'
import { ProjectClasseGranted } from '../../../../../modules/project/events'

describe('project.onProjectClasseGranted', () => {
  const fakeProjects = [
    {
      id: 'target',
      classe: 'Eliminé',
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.classe to Classé', async () => {
    await onProjectClasseGranted(models)(
      new ProjectClasseGranted({
        payload: {
          projectId: 'target',
          grantedBy: 'user1',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    expect(updatedProject.classe).toEqual('Classé')
  })
})
