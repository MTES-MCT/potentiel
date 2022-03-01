import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getPuissanceProjet } from './getPuissanceProjet'

const { Project } = models

const projectId = new UniqueEntityID().toString()

describe('Sequelize getPuissanceProjet', () => {
  it('should return the puissance', async () => {
    await resetDatabase()

    await Project.create(makeFakeProject({ id: projectId, puissance: 123 }))

    expect((await getPuissanceProjet(projectId))._unsafeUnwrap()).toEqual(123)
  })
})
