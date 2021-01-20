import models from '../models'
import { resetDatabase } from '../helpers'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeFile from '../../../__tests__/fixtures/file'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeGetModificationRequestListForUser } from './getModificationRequestListForUser'
import { UniqueEntityID } from '../../../core/domain'
import { UnwrapForTest as OldUnwrapForTest } from '../../../types'
import { makeUser } from '../../../entities'

describe('Sequelize getModificationRequestListForUser', () => {
  const getModificationRequestListForUser = makeGetModificationRequestListForUser(models)

  const modificationRequestId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  const projectInfo = {
    id: projectId,
    nomProjet: 'nomProjet',
    communeProjet: 'communeProjet',
    departementProjet: 'departementProjet',
    regionProjet: 'regionProjet',
    appelOffreId: 'Fessenheim',
    periodeId: '1',
    familleId: 'familleId',
  }

  describe('when user is admin', () => {
    const fakeUserInfo = makeFakeUser({
      id: userId,
      fullName: 'John Doe',
      role: 'admin',
      email: 'email@test.test',
    })
    const fakeUser = OldUnwrapForTest(makeUser(fakeUserInfo))

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      const ProjectModel = models.Project
      await ProjectModel.create(makeFakeProject(projectInfo))

      const FileModel = models.File
      await FileModel.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      const UserModel = models.User
      await UserModel.create(fakeUser)

      const ModificationRequestModel = models.ModificationRequest
      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'recours',
        requestedOn: 123,
        status: 'envoyée',
        justification: 'justification',
      })
    })

    it('should return a paginated list of all modification requests', async () => {
      const res = await getModificationRequestListForUser(fakeUser, { page: 0, pageSize: 1 })

      expect(res.isOk()).toBe(true)

      expect(res._unsafeUnwrap().itemCount).toEqual(1)
      expect(res._unsafeUnwrap().items[0]).toEqual(
        expect.objectContaining({
          id: modificationRequestId,
          status: 'envoyée',
          requestedOn: new Date(123),
          requestedBy: {
            email: 'email@test.test',
            fullName: 'John Doe',
          },
          attachmentFile: {
            filename: 'filename',
            id: fileId,
          },
          project: {
            nomProjet: 'nomProjet',
            communeProjet: 'communeProjet',
            departementProjet: 'departementProjet',
            regionProjet: 'regionProjet',
            appelOffreId: 'Fessenheim',
            periodeId: '1',
            familleId: 'familleId',
            unitePuissance: 'MWc', // see fessenheim.ts
          },
          type: 'recours',
          justification: 'justification',
        })
      )
    })
  })

  describe('when user is porteur-projet', () => {
    const fakeUserInfo = makeFakeUser({
      id: userId,
      fullName: 'John Doe',
      role: 'porteur-projet',
      email: 'email@test.test',
    })
    const fakeUser = OldUnwrapForTest(makeUser(fakeUserInfo))

    const otherUserId = new UniqueEntityID().toString()
    const fakeOtherUser = OldUnwrapForTest(makeUser(makeFakeUser({ id: otherUserId })))

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      const ProjectModel = models.Project
      await ProjectModel.create(makeFakeProject(projectInfo))

      const FileModel = models.File
      await FileModel.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      const UserModel = models.User
      await UserModel.create(fakeUser)
      await UserModel.create(fakeOtherUser)

      const ModificationRequestModel = models.ModificationRequest
      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'recours',
        requestedOn: 123,
        status: 'envoyée',
        justification: 'justification',
      })

      // Create a modification request from otherUser
      await ModificationRequestModel.create({
        id: new UniqueEntityID().toString(),
        projectId,
        userId: otherUserId,
        fileId,
        type: 'other',
        requestedOn: 456,
        status: 'envoyée',
        justification: 'justification2',
      })
    })

    it('should return a paginated list of the user‘s modification requests', async () => {
      const res = await getModificationRequestListForUser(fakeUser, { page: 0, pageSize: 1 })

      expect(res.isOk()).toBe(true)

      expect(res._unsafeUnwrap().itemCount).toEqual(1)
      expect(res._unsafeUnwrap().items[0].id).toEqual(modificationRequestId)
    })
  })
})
