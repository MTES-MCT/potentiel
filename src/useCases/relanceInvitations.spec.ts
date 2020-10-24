import { projectAdmissionKeyRepo, resetDatabase } from '../dataAccess/inMemory'
import { makeProjectAdmissionKey } from '../entities'
import routes from '../routes'
import makeRelanceInvitations from './relanceInvitations'

const sendNotification = jest.fn()
const relanceInvitations = makeRelanceInvitations({
  projectAdmissionKeyRepo,
  sendNotification,
})

describe('relanceInvitations use-case', () => {
  const userEmail: string = 'pp-unused1@test.com'

  describe('given a list of invitationIds', () => {
    beforeAll(async () => {
      resetDatabase()
      sendNotification.mockClear()

      const projectAdmissionKeys = (
        await Promise.all(
          [
            {
              email: 'pp-unused1@test.com',
              fullName: 'pp-unused1',
              createdAt: 1,
              lastUsedAt: 0,
            },
            {
              email: 'pp-unused1@test.com',
              fullName: 'also pp-unused1',
              createdAt: 1,
              lastUsedAt: 0,
            },
            {
              email: 'pp-unused2@test.com',
              fullName: 'pp-unused2',
              createdAt: 1,
              lastUsedAt: 0,
            },
            {
              email: 'pp-unused3@test.com',
              fullName: 'will be ignored',
              createdAt: 1,
              lastUsedAt: 0,
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map((item) =>
              projectAdmissionKeyRepo.save(item).then((result) => result.map(() => item))
            )
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKeys).toHaveLength(4)

      const [pp1_invitation1, , pp2_invitation] = projectAdmissionKeys

      if (!pp1_invitation1 || !pp2_invitation) return

      const res = await relanceInvitations({
        keys: [pp1_invitation1.id, pp2_invitation.id],
      })
      expect(res.is_ok()).toEqual(true)
      expect(res.unwrap()).toEqual(2)
    })

    it('should create a new projectAdmissionKey for each unique email', async () => {
      const newProjectAdmissionKeysForPP1 = await projectAdmissionKeyRepo.findAll({
        email: 'pp-unused1@test.com',
        lastUsedAt: 0,
      })
      expect(newProjectAdmissionKeysForPP1).toHaveLength(1)

      const newProjectAdmissionKeysForPP2 = await projectAdmissionKeyRepo.findAll({
        email: 'pp-unused2@test.com',
        lastUsedAt: 0,
      })
      expect(newProjectAdmissionKeysForPP2).toHaveLength(1)
    })

    it('should set oldProjectAdmissionKeys.lastUsedAt to newProjectAdmissionKey.createdAt for all pending invitations for concerned emails', async () => {
      const [newProjectAdmissionKeyForPP1] = await projectAdmissionKeyRepo.findAll({
        email: 'pp-unused1@test.com',
        lastUsedAt: 0,
      })
      expect(newProjectAdmissionKeyForPP1).toBeDefined()
      if (!newProjectAdmissionKeyForPP1) return

      const oldProjectAdmissionKeysForPP1 = await projectAdmissionKeyRepo.findAll({
        email: 'pp-unused1@test.com',
        createdAt: 1,
      })
      expect(oldProjectAdmissionKeysForPP1).toHaveLength(2)
      const [old1, old2] = oldProjectAdmissionKeysForPP1
      expect(old1.lastUsedAt).toEqual(newProjectAdmissionKeyForPP1.createdAt)
      expect(old2.lastUsedAt).toEqual(newProjectAdmissionKeyForPP1.createdAt)
    })
  })

  describe('given a beforeDate', () => {
    beforeAll(async () => {
      resetDatabase()
      sendNotification.mockClear()

      const projectAdmissionKeys = (
        await Promise.all(
          [
            {
              email: userEmail,
              fullName: 'pp-unused1',
              createdAt: 1,
              lastUsedAt: 0,
            },
            // Another invitation for the same user
            {
              email: userEmail,
              fullName: 'pp-unused1',
              createdAt: 1,
              lastUsedAt: 0,
            },
            {
              email: 'pp-unused2@test.com',
              fullName: '',
              createdAt: 1,
              lastUsedAt: 0,
            },
            // An invitation that is recent for the same user (will be included)
            {
              email: userEmail,
              fullName: 'pp-unused-recent',
              createdAt: 10,
              lastUsedAt: 0,
            },
            // An invitation that is recent for another user (will not be included)
            {
              email: 'another-recent@test.test',
              fullName: 'pp-unused-recent',
              createdAt: 10,
              lastUsedAt: 0,
            },
            {
              email: 'pp-used@test.com',
              fullName: '',
              lastUsedAt: 1,
            },
            {
              email: 'dreal-unused@test.com',
              fullName: '',
              dreal: 'Corse',
              lastUsedAt: 0,
            },
            {
              email: 'invited@test.com',
              fullName: '',
              lastUsedAt: 0,
              projectId: '123',
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map(projectAdmissionKeyRepo.save)
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKeys).toHaveLength(8)

      const res = await relanceInvitations({ beforeDate: 1 })
      expect(res.is_ok()).toEqual(true)
      expect(res.unwrap()).toEqual(2)
    })

    it('should create a new projectAdmissionKey for each unique email', async () => {
      // Verifiy new key creation
      const newProjectAdmissionKeys = await projectAdmissionKeyRepo.findAll({
        email: userEmail,
        lastUsedAt: 0,
      })

      expect(newProjectAdmissionKeys).toHaveLength(1)
      const [newProjectAdmissionKey] = newProjectAdmissionKeys
      if (!newProjectAdmissionKey) return

      // Make sure its new and not one of the old ones
      expect((newProjectAdmissionKey.createdAt || 0) / 1000).toBeCloseTo(Date.now() / 1000, 0)
    })

    it('should set oldProjectAdmissionKeys.lastUsedAt to newProjectAdmissionKey.createdAt', async () => {
      // Verifiy new key creation
      const newProjectAdmissionKeys = await projectAdmissionKeyRepo.findAll({
        email: userEmail,
        lastUsedAt: 0,
      })

      expect(newProjectAdmissionKeys).toHaveLength(1)
      const [newProjectAdmissionKey] = newProjectAdmissionKeys
      if (!newProjectAdmissionKey) return

      // Make sure the old project admission keys have been updated
      const updatedOldProjectAdmissionKeys = (
        await projectAdmissionKeyRepo.findAll({
          email: userEmail,
        })
      ).filter((item) => item.id !== newProjectAdmissionKey.id)

      expect(updatedOldProjectAdmissionKeys).toHaveLength(3)
      if (updatedOldProjectAdmissionKeys.length !== 3) return

      const [old1, old2, old3] = updatedOldProjectAdmissionKeys
      expect(old1.lastUsedAt).toEqual(newProjectAdmissionKey.createdAt)
      expect(old2.lastUsedAt).toEqual(newProjectAdmissionKey.createdAt)
      expect(old3.lastUsedAt).toEqual(newProjectAdmissionKey.createdAt)
    })

    it('should avoid projectAdmissionKeys that are more recent than beforeDate, except if there is an older projectAdmissionKey with the same email', async () => {
      // userEmail does have an older projectAdmissionKey
      // but another-recent@test.test does not

      const [recentProjectAdmissionKey] = await projectAdmissionKeyRepo.findAll({
        email: 'another-recent@test.test',
      })

      expect(recentProjectAdmissionKey).toBeDefined()
      if (!recentProjectAdmissionKey) return

      // Make sure this one is unchanged
      expect(recentProjectAdmissionKey.lastUsedAt).toEqual(0)
      expect(recentProjectAdmissionKey.createdAt).toEqual(10)
    })

    it('should send an email notification to porteurs projets that have not used their invitation', async () => {
      expect(sendNotification).toHaveBeenCalledTimes(2)

      const sentEmails = sendNotification.mock.calls.map((item) => item[0])

      const sentEmailForUser1 = sentEmails.find((email) => email.message.email === userEmail)
      expect(sentEmailForUser1).toBeDefined()
      if (!sentEmailForUser1) return
      expect(sentEmailForUser1.type).toEqual('relance-designation')
      expect(sentEmailForUser1.message.name).toEqual('pp-unused1')
      expect(sentEmailForUser1.message.subject).toEqual("Résultats de l'appel d'offres")

      // The email should contain the new invitation key
      const newProjectAdmissionKeys = await projectAdmissionKeyRepo.findAll({
        email: userEmail,
        lastUsedAt: 0,
      })
      expect(newProjectAdmissionKeys).toHaveLength(1)
      const [newProjectAdmissionKey] = newProjectAdmissionKeys
      if (!newProjectAdmissionKey) return
      expect((sentEmailForUser1.variables as any).invitation_link).toContain(
        routes.PROJECT_INVITATION({
          projectAdmissionKey: newProjectAdmissionKey.id,
        })
      )

      // Also for the other unused invitation
      const sentEmailForUser2 = sentEmails.find(
        (email) => email.message.email === 'pp-unused2@test.com'
      )
      expect(sentEmailForUser2).toBeDefined()
    })
  })

  describe('given an appelOffreId', () => {
    beforeAll(async () => {
      resetDatabase()
      sendNotification.mockClear()

      const projectAdmissionKeys = (
        await Promise.all(
          [
            {
              email: userEmail,
              fullName: 'Good AppelOffreId',
              appelOffreId: 'Fessenheim',
              periodeId: '1',
              createdAt: 123,
              lastUsedAt: 0,
            },
            {
              email: 'other@test.test',
              fullName: 'Good AppelOffreId 2',
              appelOffreId: 'Fessenheim',
              periodeId: '2',
              createdAt: 123,
              lastUsedAt: 0,
            },
            {
              email: userEmail,
              fullName: 'Bad AppelOffreId but same email',
              appelOffreId: 'Autre',
              createdAt: 123,
              lastUsedAt: 0,
            },
            {
              email: 'pp-unused2@test.com',
              fullName: 'Bad AppelOffreId',
              appelOffreId: 'Autre',
              createdAt: 1,
              lastUsedAt: 0,
            },
            {
              email: userEmail,
              fullName: 'Good AppelOffreId but used',
              appelOffreId: 'Fessenheim',
              periodeId: '2',
              createdAt: 1,
              lastUsedAt: 123,
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map(projectAdmissionKeyRepo.save)
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKeys).toHaveLength(5)

      const res = await relanceInvitations({ appelOffreId: 'Fessenheim' })
      expect(res.is_ok()).toEqual(true)
      expect(res.unwrap()).toEqual(2)
    })

    it('should handle projectAdmissionKeys that are unused and from the same appelOffre, or projectAdmissionKey for the same email', async () => {
      // userEmail does have an older projectAdmissionKey
      // but another-recent@test.test does not

      const targetProjectAdmissionKeys = await projectAdmissionKeyRepo.findAll({
        createdAt: 123,
      })

      expect(targetProjectAdmissionKeys).toHaveLength(3)

      const [target1, target2, target3] = targetProjectAdmissionKeys
      if (!target1 || !target2 || !target3) return

      expect(target1.lastUsedAt).not.toEqual(0)
      expect(target2.lastUsedAt).not.toEqual(0)
      expect(target3.lastUsedAt).not.toEqual(0)

      const [unchanged1] = await projectAdmissionKeyRepo.findAll({
        fullName: 'Good AppelOffreId but used',
      })
      expect(unchanged1).toBeDefined()
      if (!unchanged1) return
      expect(unchanged1.lastUsedAt).toEqual(123)

      const [unchanged2] = await projectAdmissionKeyRepo.findAll({
        fullName: 'Bad AppelOffreId',
      })
      expect(unchanged2).toBeDefined()
      if (!unchanged2) return
      expect(unchanged2.lastUsedAt).toEqual(0)
    })
  })

  describe('given an appelOffreId and periodeId', () => {
    beforeAll(async () => {
      resetDatabase()
      sendNotification.mockClear()

      const projectAdmissionKeys = (
        await Promise.all(
          [
            {
              email: userEmail,
              fullName: 'Good AppelOffreId Good PeriodeId',
              appelOffreId: 'Fessenheim',
              periodeId: '1',
              createdAt: 123,
              lastUsedAt: 0,
            },
            {
              email: 'other@test.test',
              fullName: 'Good AppelOffreId Bad PeriodeId',
              appelOffreId: 'Fessenheim',
              periodeId: '2',
              createdAt: 123,
              lastUsedAt: 0,
            },
          ]
            .map(makeProjectAdmissionKey)
            .filter((item) => item.is_ok())
            .map((item) => item.unwrap())
            .map(projectAdmissionKeyRepo.save)
        )
      )
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())

      expect(projectAdmissionKeys).toHaveLength(2)

      const res = await relanceInvitations({
        appelOffreId: 'Fessenheim',
        periodeId: '1',
      })
      expect(res.is_ok()).toEqual(true)
      expect(res.unwrap()).toEqual(1)
    })

    it('should handle projectAdmissionKeys that are unused and from the same appelOffre, or projectAdmissionKey for the same email', async () => {
      // userEmail does have an older projectAdmissionKey
      // but another-recent@test.test does not

      const [targetProjectAdmissionKey] = await projectAdmissionKeyRepo.findAll({
        fullName: 'Good AppelOffreId Good PeriodeId',
      })

      expect(targetProjectAdmissionKey).toBeDefined()
      if (!targetProjectAdmissionKey) return

      expect(targetProjectAdmissionKey.lastUsedAt).not.toEqual(0)

      const [unchanged] = await projectAdmissionKeyRepo.findAll({
        fullName: 'Good AppelOffreId Bad PeriodeId',
      })
      expect(unchanged).toBeDefined()
      if (!unchanged) return
      expect(unchanged.lastUsedAt).toEqual(0)
    })
  })
})
