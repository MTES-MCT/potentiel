import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onProjectClasseGranted } from './onProjectClasseGranted'
import { ProjectClasseGranted } from '@modules/project'
import { v4 as uuid } from 'uuid'

describe('project.onProjectClasseGranted', () => {
  const projectId = uuid()
  const fakeProjects = [
    {
      id: projectId,
      classe: 'Eliminé',
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.classe to Classé', async () => {
    await onProjectClasseGranted(models)(
      new ProjectClasseGranted({
        payload: {
          projectId,
          grantedBy: 'user1',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.classe).toEqual('Classé')
  })
})
