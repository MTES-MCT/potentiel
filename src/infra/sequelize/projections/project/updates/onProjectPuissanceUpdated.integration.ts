import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onProjectPuissanceUpdated } from './onProjectPuissanceUpdated'
import { ProjectPuissanceUpdated } from '@modules/project'
import { v4 as uuid } from 'uuid'

describe('project.onProjectPuissanceUpdated', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
  const project = makeFakeProject({ id: projectId, puissanceInitiale: 100, puissance: 100 })

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
    await ProjectModel.bulkCreate([project])
  })

  it('should update the project puissance', async () => {
    const newPuissance = 109

    await onProjectPuissanceUpdated(models)(
      new ProjectPuissanceUpdated({
        payload: { projectId, newPuissance, updatedBy: 'someone' },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.puissance).toEqual(newPuissance)
    expect(updatedProject.puissanceInitiale).toEqual(100)
  })
})
