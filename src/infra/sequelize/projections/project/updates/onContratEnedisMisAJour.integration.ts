import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onContratEnedisMisAJour } from './onContratEnedisMisAJour'
import { ContratEnedisMisAJour } from '@modules/enedis'
import { v4 as uuid } from 'uuid'

describe('project.onContratEnedisMisAJour', () => {
  const ProjectModel = models.Project
  const projectId = uuid()
  const project = makeFakeProject({
    id: projectId,
    contratEnedis: {
      numero: '1234',
    },
  })

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
    await ProjectModel.bulkCreate([project])
  })

  it('should set the project contratEnedis', async () => {
    await onContratEnedisMisAJour(models)(
      new ContratEnedisMisAJour({
        payload: {
          projectId,
          numero: '123',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.contratEnedis).toMatchObject({
      numero: '123',
    })
  })
})
