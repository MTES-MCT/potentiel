import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onProjectProducteurUpdated } from './onProjectProducteurUpdated'
import { ProjectProducteurUpdated } from '../../../../../modules/project/events'
import { v4 as uuid } from 'uuid'

describe('project.onProjectProducteurUpdated', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
  const project = makeFakeProject({ id: projectId, producteur: 'old producteur' })

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
    await ProjectModel.bulkCreate([project])
  })

  it('should update the project puissance', async () => {
    const newProducteur = 'new producteur'

    await onProjectProducteurUpdated(models)(
      new ProjectProducteurUpdated({
        payload: { projectId, newProducteur, updatedBy: 'someone' },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.nomCandidat).toEqual(newProducteur)
  })
})
