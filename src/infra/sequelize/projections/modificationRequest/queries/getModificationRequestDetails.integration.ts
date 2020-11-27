import models from '../../../models'
import { sequelize } from '../../../../../sequelize.config'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import makeFakeFile from '../../../../../__tests__/fixtures/file'
import makeFakeUser from '../../../../../__tests__/fixtures/user'
import { makeGetModificationRequestDetails } from './getModificationRequestDetails'
import { UniqueEntityID } from '../../../../../core/domain'

describe('Sequelize getModificationRequestDetails', () => {
  const getModificationRequestDetails = makeGetModificationRequestDetails(models)

  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

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

  let versionDate: Date | undefined

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    const ProjectModel = models.Project
    await ProjectModel.create(makeFakeProject(projectInfo))

    const FileModel = models.File
    await FileModel.create(makeFakeFile({ id: fileId, filename: 'filename' }))

    console.log('beforeall creating file')
    const UserModel = models.User
    await UserModel.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

    const ModificationRequestModel = models.ModificationRequest
    const { updatedAt } = await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      userId,
      fileId,
      type: 'recours',
      requestedOn: 123,
      status: 'envoyée',
      justification: 'justification',
    })

    versionDate = updatedAt
  })

  it('should return a complete AdminModificationRequestDTO', async () => {
    const modificationRequestResult = await getModificationRequestDetails(
      modificationRequestId.toString()
    )

    expect(modificationRequestResult.isOk()).toBe(true)
    if (modificationRequestResult.isErr()) return

    const modificationRequestDTO = modificationRequestResult.value

    expect(modificationRequestDTO).toEqual({
      id: modificationRequestId,
      type: 'recours',
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
