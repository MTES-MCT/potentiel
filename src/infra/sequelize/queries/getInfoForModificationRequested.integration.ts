import models from '../models'
import { resetDatabase } from '../helpers'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeFile from '../../../__tests__/fixtures/file'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeGetInfoForModificationRequested } from './getInfoForModificationRequested'
import { UniqueEntityID } from '../../../core/domain'

describe('Sequelize getInfoForModificationRequested', () => {
  const getInfoForModificationRequested = makeGetInfoForModificationRequested(models)

  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  const projectInfo = {
    id: projectId,
    nomProjet: 'nomProjet',
  }

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    const ProjectModel = models.Project
    await ProjectModel.create(makeFakeProject(projectInfo))

    const UserModel = models.User
    await UserModel.create(
      makeFakeUser({ id: userId, fullName: 'John Doe', email: 'email@test.test' })
    )
  })

  it('should return project nomProjet and user fullName and email', async () => {
    const res = await getInfoForModificationRequested({ projectId, userId })

    expect(res._unsafeUnwrap()).toEqual({
      nomProjet: 'nomProjet',
      porteurProjet: {
        fullName: 'John Doe',
        email: 'email@test.test',
      },
    })
  })
})
