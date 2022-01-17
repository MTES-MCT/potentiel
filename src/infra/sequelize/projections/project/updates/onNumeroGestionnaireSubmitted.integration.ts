import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onNumeroGestionnaireSubmitted } from './onNumeroGestionnaireSubmitted'
import { NumeroGestionnaireSubmitted } from '@modules/project'
import { v4 as uuid } from 'uuid'

describe('project.onNumeroGestionnaireSubmitted', () => {
  const projectId = uuid()
  const fakeProjects = [
    {
      id: projectId,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.classe to Classé', async () => {
    const originalProject = await ProjectModel.findByPk(projectId)
    expect(originalProject.numeroGestionnaire).toEqual(null)

    await onNumeroGestionnaireSubmitted(models)(
      new NumeroGestionnaireSubmitted({
        payload: {
          projectId,
          submittedBy: 'user1',
          numeroGestionnaire: 'numero gestionnaire',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.numeroGestionnaire).toEqual('numero gestionnaire')
  })
})
