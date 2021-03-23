import models from '../models'
import { resetDatabase } from '../helpers'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeFile from '../../../__tests__/fixtures/file'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeGetModificationRequestDetails } from './getModificationRequestDetails'
import { UniqueEntityID } from '../../../core/domain'

describe('Sequelize getModificationRequestDetails', () => {
  const getModificationRequestDetails = makeGetModificationRequestDetails(models)

  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const userId2 = new UniqueEntityID().toString()

  const projectInfo = {
    id: projectId,
    numeroCRE: 'numeroCRE',
    nomProjet: 'nomProjet',
    nomCandidat: 'nomCandidat',
    communeProjet: 'communeProjet',
    departementProjet: 'departementProjet',
    regionProjet: 'regionProjet',
    puissance: 123,
    notifiedOn: new Date(321).getTime(),
    appelOffreId: 'Fessenheim',
    periodeId: '1',
    familleId: 'familleId',
  }

  const versionDate = new Date(456)

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    const ProjectModel = models.Project
    await ProjectModel.create(makeFakeProject(projectInfo))

    const FileModel = models.File
    await FileModel.create(makeFakeFile({ id: fileId, filename: 'filename' }))

    const UserModel = models.User
    await UserModel.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))
    await UserModel.create(makeFakeUser({ id: userId2, fullName: 'Admin Doe' }))

    const ModificationRequestModel = models.ModificationRequest
    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      userId,
      fileId,
      type: 'recours',
      requestedOn: 123,
      respondedOn: 321,
      respondedBy: userId2,
      status: 'envoyée',
      justification: 'justification',
      versionDate,
    })
  })

  it('should return a complete AdminModificationRequestDTO', async () => {
    const modificationRequestResult = await getModificationRequestDetails(
      modificationRequestId.toString()
    )

    expect(modificationRequestResult.isOk()).toBe(true)
    if (modificationRequestResult.isErr()) return

    const modificationRequestDTO = modificationRequestResult.value

    expect(modificationRequestDTO).toMatchObject({
      id: modificationRequestId,
      type: 'recours',
      status: 'envoyée',
      respondedOn: new Date(321),
      respondedBy: 'Admin Doe',
      versionDate,
      requestedOn: new Date(123),
      requestedBy: 'John Doe',
      justification: 'justification',
      attachmentFile: {
        filename: 'filename',
        id: fileId,
      },
      project: {
        ...projectInfo,
        unitePuissance: 'MWc',
        notifiedOn: new Date(projectInfo.notifiedOn),
      },
    })
  })
})
