import {
  appelOffreRepo,
  appelsOffreStatic,
  credentialsRepo,
  projectAdmissionKeyRepo,
  resetDatabase,
  userRepo,
} from '../dataAccess/inMemory'
import moment from 'moment'
import {
  makeProject,
  makeUser,
  Project,
  User,
  makeCredentials,
} from '../entities'
import routes from '../routes'
import { UnwrapForTest, Ok } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import { PORTEUR_PROJET } from '../__tests__/fixtures/testCredentials'
import addAppelOffreToProject from '../__tests__/fixtures/addAppelOffreToProject'
import makeSendAllCandidateNotifications, {
  UNAUTHORIZED_ERROR,
  INVALID_APPELOFFRE_PERIOD_ERROR,
  ERREUR_AUCUN_PROJET_NON_NOTIFIE,
} from './sendAllCandidateNotifications'

const pagination = {
  page: 0,
  pageSize: 10,
}

const makePaginatedProjectList = (projects: Project[]) => ({
  items: projects,
  pagination,
  pageCount: 1,
  itemCount: projects.length,
})

describe('sendAllCandidateNotifications use-case', () => {
  const appelOffreId = 'Fessenheim'
  const periodeId = '2'
  const notifiedOn = Date.now()

  beforeAll(async () => {
    resetDatabase()
  })

  describe('given user is admin or dgec', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

    describe('given a valid appel offre and periode', () => {
      const fakeOtherUserIdWithEmail = 'otherUserId'

      const fakeEmail = 'fake@email.test'
      const fakeName = 'Fakester McFakeFace'
      const fakeProject1 = UnwrapForTest(
        makeProject(
          makeFakeProject({
            email: fakeEmail,
            nomRepresentantLegal: fakeName,
            appelOffreId,
            periodeId,
            familleId: '1',
          })
        )
      )
      const fakeProject2 = UnwrapForTest(
        makeProject(
          makeFakeProject({
            email: fakeEmail,
            nomRepresentantLegal: fakeName,
            appelOffreId,
            periodeId,
            familleId: '3', // Pas de GF
          })
        )
      )
      const fakeProjects = [fakeProject1, fakeProject2]
      fakeProjects.forEach(addAppelOffreToProject)
      const fakeProjectList = makePaginatedProjectList(fakeProjects)

      const findAllProjects = jest.fn(async () => fakeProjectList)
      const saveProject = jest.fn(async () => Ok(null))
      const sendNotification = jest.fn()

      const sendAllCandidateNotifications = makeSendAllCandidateNotifications({
        findAllProjects,
        saveProject,
        appelOffreRepo,
        projectAdmissionKeyRepo,
        sendNotification,
      })

      beforeAll(async () => {
        await credentialsRepo.insert(
          UnwrapForTest(
            makeCredentials({
              ...PORTEUR_PROJET,
              email: fakeEmail,
              userId: fakeOtherUserIdWithEmail,
            })
          )
        )

        const res = await sendAllCandidateNotifications({
          appelOffreId,
          periodeId,
          notifiedOn,
          user,
        })

        expect(res.is_ok()).toEqual(true)
      })

      it('should send one notification per unique email of projects that have not been notified in this periode, with an invitation link included', async () => {
        expect(findAllProjects).toHaveBeenCalledWith({
          appelOffreId,
          periodeId,
          isNotified: false,
        })

        // Verify project admission key
        const projectAdmissionKeys = await projectAdmissionKeyRepo.findAll()
        expect(projectAdmissionKeys).toHaveLength(1)
        const projectAdmissionKey = projectAdmissionKeys[0]
        expect(projectAdmissionKey.email).toEqual(fakeEmail)
        expect(projectAdmissionKey.fullName).toEqual(fakeName)

        expect(sendNotification).toHaveBeenCalledTimes(1)
        expect(sendNotification).toHaveBeenCalledWith({
          type: 'designation',
          context: {
            projectAdmissionKeyId: projectAdmissionKey.id,
            appelOffreId,
            periodeId,
          },
          variables: {
            invitation_link: routes.PROJECT_INVITATION({
              projectAdmissionKey: projectAdmissionKey.id,
            }),
          },
          message: {
            subject: `Résultats de la deuxième période de l'appel d'offres Fessenheim 2019/S 019-040037`,
            email: fakeEmail,
            name: fakeName,
          },
        })
      })

      it('should update each unnotified project from the periode as having been notified and set the garanties financieres due date if the famille requires them', async () => {
        expect(saveProject).toHaveBeenCalledTimes(2)

        const fakeProject1Update = saveProject.mock.calls
          .filter((args: any[]) => args[0].id === fakeProject1.id)
          .map((args: any[]) => args[0])
          .pop()
        expect(fakeProject1Update).toBeDefined()
        expect(fakeProject1Update.notifiedOn).toEqual(notifiedOn)
        expect(fakeProject1Update.history).toHaveLength(1)
        const notificationEvent1 = fakeProject1Update.history[0]
        expect(notificationEvent1.userId).toEqual(user.id)
        expect(notificationEvent1.type).toEqual('candidate-notification')
        expect(notificationEvent1.after).toEqual({
          notifiedOn,
          // This project requires GF
          garantiesFinancieresDueDate: moment(notifiedOn)
            .add(2, 'months')
            .toDate()
            .getTime(),
        })

        const fakeProject2Update = saveProject.mock.calls
          .filter((args: any[]) => args[0].id === fakeProject2.id)
          .map((args: any[]) => args[0])
          .pop()
        expect(fakeProject2Update).toBeDefined()
        const notificationEvent2 = fakeProject2Update.history[0]
        expect(notificationEvent2.userId).toEqual(user.id)
        expect(notificationEvent2.type).toEqual('candidate-notification')
        expect(notificationEvent2.after).toEqual({
          notifiedOn,
          // This project does not require GF
        })
      })
    })

    describe('given invalid periode', () => {
      const findAllProjects = jest.fn()
      const saveProject = jest.fn()
      const sendNotification = jest.fn()
      const sendAllCandidateNotifications = makeSendAllCandidateNotifications({
        findAllProjects,
        saveProject,
        appelOffreRepo,
        projectAdmissionKeyRepo,
        sendNotification,
      })

      it('should return INVALID_APPELOFFRE_PERIOD_ERROR', async () => {
        const res = await sendAllCandidateNotifications({
          appelOffreId: 'other',
          periodeId,
          notifiedOn,
          user,
        })

        expect(res.is_err()).toEqual(true)
        expect(res.unwrap_err().message).toEqual(
          INVALID_APPELOFFRE_PERIOD_ERROR
        )

        expect(findAllProjects).not.toHaveBeenCalled()
        expect(saveProject).not.toHaveBeenCalled()
        expect(sendNotification).not.toHaveBeenCalled()
      })
    })

    describe('given no unnotified project for this periode', () => {
      const findAllProjects = jest.fn(async () => makePaginatedProjectList([]))
      const saveProject = jest.fn()
      const sendNotification = jest.fn()

      const sendAllCandidateNotifications = makeSendAllCandidateNotifications({
        findAllProjects,
        saveProject,
        appelOffreRepo,
        projectAdmissionKeyRepo,
        sendNotification,
      })

      it('should return ERREUR_AUCUN_PROJET_NON_NOTIFIE', async () => {
        const res = await sendAllCandidateNotifications({
          appelOffreId,
          periodeId,
          notifiedOn,
          user,
        })

        expect(res.is_err()).toEqual(true)
        expect(res.unwrap_err().message).toEqual(
          ERREUR_AUCUN_PROJET_NON_NOTIFIE
        )

        expect(saveProject).not.toHaveBeenCalled()
        expect(sendNotification).not.toHaveBeenCalled()
      })
    })
  })

  describe('user is not admin/dgec', () => {
    const user = UnwrapForTest(
      makeUser(makeFakeUser({ role: 'porteur-projet' }))
    )

    const findAllProjects = jest.fn()
    const saveProject = jest.fn()
    const sendNotification = jest.fn()
    const sendAllCandidateNotifications = makeSendAllCandidateNotifications({
      findAllProjects,
      saveProject,
      appelOffreRepo,
      projectAdmissionKeyRepo,
      sendNotification,
    })

    it('should return UNAUTHORIZED_ERROR', async () => {
      const res = await sendAllCandidateNotifications({
        appelOffreId,
        periodeId,
        notifiedOn,
        user,
      })

      expect(res.is_err()).toEqual(true)
      expect(res.unwrap_err().message).toEqual(UNAUTHORIZED_ERROR)

      expect(findAllProjects).not.toHaveBeenCalled()
      expect(saveProject).not.toHaveBeenCalled()
      expect(sendNotification).not.toHaveBeenCalled()
    })
  })
})
