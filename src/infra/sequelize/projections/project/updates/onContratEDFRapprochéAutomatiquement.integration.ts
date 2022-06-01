import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onContratEDFRapprochéAutomatiquement } from './onContratEDFRapprochéAutomatiquement'
import { ContratEDFRapprochéAutomatiquement } from '@modules/edf'
import { v4 as uuid } from 'uuid'

describe('project.onContratEDFRapprochéAutomatiquement', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
  const project = makeFakeProject({ id: projectId, puissanceInitiale: 100, puissance: 100 })

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
    await ProjectModel.bulkCreate([project])
  })

  it('should set the project contratEDF', async () => {
    await onContratEDFRapprochéAutomatiquement(models)(
      new ContratEDFRapprochéAutomatiquement({
        payload: {
          projectId,
          numero: '123',
          type: 'type',
          dateEffet: '3/23/21',
          dateSignature: '5/2/20',
          dateMiseEnService: '1/1/22',
          duree: '1234',
          statut: 'SIGNE',
          rawValues: {},
          score: 34,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.contratEDF).toMatchObject({
      numero: '123',
      type: 'type',
      dateEffet: '3/23/21',
      dateSignature: '5/2/20',
      dateMiseEnService: '1/1/22',
      duree: 1234,
      statut: 'SIGNE',
    })
  })
})
