import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onProjectFournisseursUpdated } from './onProjectFournisseursUpdated'
import { ProjectFournisseursUpdated, Fournisseur } from '@modules/project'
import { UniqueEntityID } from '@core/domain'

describe('project.onProjectFournisseursUpdated', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const project = makeFakeProject({
    id: projectId,
    details: {
      'Nom du fabricant \n(Modules ou films)': 'oldFabricant1',
      'Nom du fabricant \n(Postes de conversion)': 'oldFabricant2',
    },
    evaluationCarbone: 50,
  })

  beforeAll(async () => {
    await resetDatabase()
    await Project.bulkCreate([project])
  })

  it('should update the project fournisseurs and evaluation carbone', async () => {
    const newEvaluationCarbone = 100
    const newFournisseurs: Fournisseur[] = [
      {
        kind: 'Nom du fabricant \n(Modules ou films)',
        name: 'newFabricant1',
      },
      { kind: 'Nom du fabricant (Cellules)', name: 'newFabricant2' },
    ]

    await onProjectFournisseursUpdated(models)(
      new ProjectFournisseursUpdated({
        payload: { projectId, newFournisseurs, newEvaluationCarbone, updatedBy: 'someone' },
      })
    )

    const updatedProject = await Project.findByPk(projectId)
    expect(updatedProject.details).toMatchObject({
      'Nom du fabricant \n(Postes de conversion)': 'oldFabricant2',
      'Nom du fabricant \n(Modules ou films)': 'newFabricant1',
      'Nom du fabricant (Cellules)': 'newFabricant2',
    })
    expect(updatedProject.evaluationCarbone).toEqual(newEvaluationCarbone)
  })
})
