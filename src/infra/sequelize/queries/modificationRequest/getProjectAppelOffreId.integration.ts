import { UniqueEntityID } from '../../../../core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getProjectAppelOffreId } from './getProjectAppelOffreId'

const { Project } = models

const projectId = new UniqueEntityID().toString()

describe('Sequelize getProjectAppelOffreId', () => {
  it('should return the appelOffreId', async () => {
    await resetDatabase()

    const appelOffreId = 'appelOffreId123'

    await Project.create(makeFakeProject({ id: projectId, appelOffreId }))

    expect((await getProjectAppelOffreId(projectId))._unsafeUnwrap()).toEqual(appelOffreId)
  })
})
