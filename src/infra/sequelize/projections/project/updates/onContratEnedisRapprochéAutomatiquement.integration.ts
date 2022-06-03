import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onContratEnedisRapprochéAutomatiquement } from './onContratEnedisRapprochéAutomatiquement'
import { ContratEnedisRapprochéAutomatiquement } from '@modules/enedis'
import { v4 as uuid } from 'uuid'

describe('project.onContratEnedisRapprochéAutomatiquement', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
  const project = makeFakeProject({ id: projectId, puissanceInitiale: 100, puissance: 100 })

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
    await ProjectModel.bulkCreate([project])
  })

  it('should set the project contratEnedis', async () => {
    await onContratEnedisRapprochéAutomatiquement(models)(
      new ContratEnedisRapprochéAutomatiquement({
        payload: {
          projectId,
          numero: '123',
          rawValues: {},
          score: 34,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.contratEnedis).toMatchObject({
      numero: '123',
    })
  })
})
