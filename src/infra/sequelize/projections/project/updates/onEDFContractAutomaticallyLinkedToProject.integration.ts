import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onEDFContractAutomaticallyLinkedToProject } from './onEDFContractAutomaticallyLinkedToProject'
import { EDFContractAutomaticallyLinkedToProject } from '@modules/edf'
import { v4 as uuid } from 'uuid'

describe('project.onEDFContractAutomaticallyLinkedToProject', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
  const project = makeFakeProject({ id: projectId, puissanceInitiale: 100, puissance: 100 })

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
    await ProjectModel.bulkCreate([project])
  })

  it('should set the project contratEDF', async () => {
    await onEDFContractAutomaticallyLinkedToProject(models)(
      new EDFContractAutomaticallyLinkedToProject({
        payload: {
          projectId,
          numero: '123',
          type: 'type',
          dateEffet: '3/23/21',
          dateSignature: '5/2/20',
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
      duree: 1234,
      statut: 'SIGNE',
    })
  })
})
