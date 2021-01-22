import models from '../models'
import { resetDatabase } from '../helpers'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeFile from '../../../__tests__/fixtures/file'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeGetModificationRequestListForUser } from './getModificationRequestListForUser'
import { UniqueEntityID } from '../../../core/domain'
import { UnwrapForTest as OldUnwrapForTest } from '../../../types'
import { makeUser } from '../../../entities'

const { Project, User, File, ModificationRequest } = models

describe('Sequelize getModificationRequestListForUser', () => {
  const getModificationRequestListForUser = makeGetModificationRequestListForUser(models)

  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  describe('generally', () => {
    const modificationRequestId = new UniqueEntityID().toString()

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

      await Project.create(makeFakeProject(projectInfo))

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(fakeUser)

      await ModificationRequest.create({
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
      const res = await getModificationRequestListForUser({
        user: fakeUser,
        pagination: { page: 0, pageSize: 1 },
      })

      expect(res.isOk()).toBe(true)

      expect(res._unsafeUnwrap().itemCount).toEqual(1)
      expect(res._unsafeUnwrap().items[0]).toMatchObject({
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
    })
  })

  describe('when user is admin', () => {
    const fakeUserInfo = makeFakeUser({
      id: userId,
      role: 'admin',
    })
    const fakeUser = OldUnwrapForTest(makeUser(fakeUserInfo))

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(makeFakeProject({ id: projectId }))

      await File.create(makeFakeFile({ id: fileId }))

      await User.create(fakeUser)

      const baseRequest = {
        projectId,
        userId,
        fileId,
        requestedOn: 123,
        status: 'envoyée',
      }

      await ModificationRequest.bulkCreate([
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'recours',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'delai',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'abandon',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'other',
        },
      ])
    })

    it('should return all modification requests of type recours, delai and abandon', async () => {
      const res = await getModificationRequestListForUser({
        user: fakeUser,
        pagination: { page: 0, pageSize: 10 },
      })

      expect(res.isOk()).toBe(true)

      expect(res._unsafeUnwrap().itemCount).toEqual(3)

      expect(
        res
          ._unsafeUnwrap()
          .items.every((modificationRequest) =>
            ['recours', 'delai', 'abandon'].includes(modificationRequest.type)
          )
      ).toBe(true)
    })
  })

  describe('when user is dreal', () => {
    const drealUserId = new UniqueEntityID().toString()
    const drealUserInfo = makeFakeUser({
      id: drealUserId,
      role: 'dreal',
    })
    const drealUser = OldUnwrapForTest(makeUser(drealUserInfo))

    const ppUserId = new UniqueEntityID().toString()
    const ppUserInfo = makeFakeUser({
      id: ppUserId,
      role: 'porteur-projet',
    })
    const ppUser = OldUnwrapForTest(makeUser(ppUserInfo))

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      const ProjectModel = models.Project
      await ProjectModel.create(makeFakeProject({ id: projectId, regionProjet: 'Bretagne' }))

      const outsideRegionProjectId = new UniqueEntityID().toString()
      await ProjectModel.create(
        makeFakeProject({ id: outsideRegionProjectId, regionProjet: 'Occitanie' })
      )

      const FileModel = models.File
      await FileModel.create(makeFakeFile({ id: fileId }))

      const UserModel = models.User
      await UserModel.create(drealUser)
      await UserModel.create(ppUser)

      const UserDrealModel = models.UserDreal
      await UserDrealModel.create({
        userId: drealUserId,
        dreal: 'Bretagne',
      })

      const ModificationRequestModel = models.ModificationRequest

      const baseRequest = {
        projectId,
        userId: ppUserId,
        fileId,
        requestedOn: 123,
        status: 'envoyée',
      }

      await ModificationRequestModel.bulkCreate([
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'puissance',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'fournisseur',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'producteur',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'actionnaire',
        },
        {
          // outside of scope because of type
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'other',
        },
        {
          // outside of scope because of project region
          ...baseRequest,
          projectId: outsideRegionProjectId,
          id: new UniqueEntityID().toString(),
          type: 'puissance',
        },
      ])
    })

    it('should return all modification requests of types puissance, fournisseur, producteur, actionnaire and in the user‘s region', async () => {
      const res = await getModificationRequestListForUser(drealUser, { page: 0, pageSize: 10 })

      expect(res.isOk()).toBe(true)

      expect(res._unsafeUnwrap().itemCount).toEqual(4)

      expect(
        res
          ._unsafeUnwrap()
          .items.every(
            (modificationRequest) =>
              ['puissance', 'fournisseur', 'producteur', 'actionnaire'].includes(
                modificationRequest.type
              ) && modificationRequest.project.regionProjet === 'Bretagne'
          )
      ).toBe(true)
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

    const userModificationRequestId = new UniqueEntityID().toString()

    const otherUserId = new UniqueEntityID().toString()
    const fakeOtherUser = OldUnwrapForTest(makeUser(makeFakeUser({ id: otherUserId })))

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(makeFakeProject(projectInfo))

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(fakeUser)
      await User.create(fakeOtherUser)

      const baseRequest = {
        projectId,
        fileId,
        requestedOn: 123,
        status: 'envoyée',
        type: 'recours',
      }

      await ModificationRequest.create({
        ...baseRequest,
        id: userModificationRequestId,
        userId,
      })

      // Create a modification request from otherUser
      await ModificationRequest.create({
        ...baseRequest,
        id: new UniqueEntityID().toString(),
        userId: otherUserId,
      })
    })

    it('should return a paginated list of the user‘s modification requests', async () => {
      const res = await getModificationRequestListForUser({
        user: fakeUser,
        pagination: { page: 0, pageSize: 10 },
      })

      expect(res.isOk()).toBe(true)

      expect(res._unsafeUnwrap().itemCount).toEqual(1)
      expect(res._unsafeUnwrap().items[0].id).toEqual(userModificationRequestId)
    })
  })
})
