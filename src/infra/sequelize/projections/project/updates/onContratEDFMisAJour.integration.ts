import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onContratEDFMisAJour } from './onContratEDFMisAJour'
import { ContratEDFMisAJour } from '@modules/edf'
import { v4 as uuid } from 'uuid'

describe('project.onContratEDFMisAJour', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
  const project = makeFakeProject({
    id: projectId,
    puissanceInitiale: 100,
    puissance: 100,
    contratEDF: {
      numero: '1234',
      type: 'type inchangé',
      duree: 1,
      status: 'SIGNE',
    },
  })

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
    await ProjectModel.bulkCreate([project])
  })

  it('should set the project contratEDF', async () => {
    await onContratEDFMisAJour(models)(
      new ContratEDFMisAJour({
        payload: {
          projectId,
          numero: '123',
          dateEffet: '3/23/21',
          dateSignature: '5/2/20',
          dateMiseEnService: '1/1/22',
          duree: '1234',
          statut: 'ACTIF',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.contratEDF).toMatchObject({
      numero: '123',
      type: 'type inchangé',
      dateEffet: '3/23/21',
      dateSignature: '5/2/20',
      dateMiseEnService: '1/1/22',
      duree: 1234,
      statut: 'ACTIF',
    })
  })
})
