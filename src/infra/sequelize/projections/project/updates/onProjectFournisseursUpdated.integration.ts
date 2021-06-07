import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onProjectFournisseursUpdated } from './onProjectFournisseursUpdated'
import { ProjectFournisseursUpdated } from '../../../../../modules/project/events'
import { v4 as uuid } from 'uuid'
import { Fournisseur } from '../../../../../entities'

describe('project.onProjectFournisseursUpdated', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
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
    await ProjectModel.bulkCreate([project])
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

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.details).toMatchObject({
      'Nom du fabricant \n(Postes de conversion)': 'oldFabricant2',
      'Nom du fabricant \n(Modules ou films)': 'newFabricant1',
      'Nom du fabricant (Cellules)': 'newFabricant2',
    })
    expect(updatedProject.evaluationCarbone).toEqual(newEvaluationCarbone)
  })
})
