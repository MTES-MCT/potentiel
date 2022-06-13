import models from '../../models'
import { resetDatabase } from '../../helpers'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import makeFakeFile from '../../../../__tests__/fixtures/file'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { getModificationRequestListForAdmin } from './getModificationRequestListForAdmin'
import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest as OldUnwrapForTest } from '../../../../types'
import { makeUser } from '@entities'

const { Project, User, File, ModificationRequest } = models

describe('Sequelize getModificationRequestListForAdmin', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

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
        authority: 'dgec',
      })

      // Create a modification request from otherUser
      await ModificationRequest.create({
        ...baseRequest,
        id: new UniqueEntityID().toString(),
        userId: otherUserId,
        authority: 'dgec',
      })
    })

    it('should return a paginated list of the user‘s modification requests', async () => {
      const res = await getModificationRequestListForAdmin({
        user: fakeUser,
        pagination: { page: 0, pageSize: 10 },
      })

      expect(res.isOk()).toBe(true)

      expect(res._unsafeUnwrap().itemCount).toEqual(1)
      expect(res._unsafeUnwrap().items[0].id).toEqual(userModificationRequestId)
    })
  })
})
