import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../helpers'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import models from '../../models'
import { getModificationRequestInfoForStatusNotification } from './getModificationRequestInfoForStatusNotification'

describe('Sequelize getModificationRequestInfoForStatusNotification', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  const projectInfo = {
    id: projectId,
    nomProjet: 'nomProjet',
    departementProjet: 'departement',
    regionProjet: 'region',
  }

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    const ProjectModel = models.Project
    await ProjectModel.create(makeFakeProject(projectInfo))

    const UserModel = models.User
    await UserModel.create(makeFakeUser({ id: userId, fullName: 'pp1', email: 'pp1@test.test' }))

    const ModificationRequestModel = models.ModificationRequest
    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'recours',
      requestedOn: 123,
      requestedBy: userId,
      status: 'envoyée',
    })
  })

  it('should return a complete ModificationRequestUpdateInfoDTO', async () => {
    const modificationRequestResult = await getModificationRequestInfoForStatusNotification(
      modificationRequestId.toString()
    )

    expect(modificationRequestResult.isOk()).toBe(true)
    if (modificationRequestResult.isErr()) return

    const modificationRequestDTO = modificationRequestResult.value

    expect(modificationRequestDTO).toEqual({
      nomProjet: 'nomProjet',
      departementProjet: 'departement',
      regionProjet: 'region',
      type: 'recours',
      porteursProjet: [
        {
          id: userId,
          fullName: 'pp1',
          email: 'pp1@test.test',
        },
      ],
    })
  })
})
