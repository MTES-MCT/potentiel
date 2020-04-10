import makeSendAllCandidateNotifications from './sendAllCandidateNotifications'
import makeSendCandidateNotification from './sendCandidateNotification'

import {
  projectRepo,
  candidateNotificationRepo,
  credentialsRepo,
  userRepo,
  projectAdmissionKeyRepo,
  appelsOffreStatic,
  appelOffreRepo,
  resetDatabase,
} from '../dataAccess/inMemory'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeCandidateNotification from '../__tests__/fixtures/candidateNotification'
import makeFakeUser from '../__tests__/fixtures/user'
import { PORTEUR_PROJET } from '../__tests__/fixtures/testCredentials'
import {
  resetEmailStub,
  sendEmailNotification,
  getCallsToEmailStub,
} from '../__tests__/fixtures/emailNotificationService'

import {
  makeUser,
  User,
  makeCredentials,
  makeProject,
  makeCandidateNotification,
} from '../entities'

const sendCandidateNotification = makeSendCandidateNotification({
  projectRepo,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendEmailNotification,
})

const sendAllCandidateNotifications = makeSendAllCandidateNotifications({
  projectRepo,
  userRepo,
  credentialsRepo,
  candidateNotificationRepo,
  sendCandidateNotification,
})

describe('sendAllCandidateNotifications use-case', () => {
  let fakeUserId: User['id'] = 'fakeUserId'
  const fakeUserProjectName = 'fakeProjectName'
  const appelOffre = appelsOffreStatic[0]
  const periode = appelOffre.periodes[0]

  beforeAll(async () => {
    resetDatabase()
    resetEmailStub()

    const previousNotifs = await candidateNotificationRepo.findAll()
    expect(previousNotifs).toBeDefined()
    expect(previousNotifs).toHaveLength(0)

    // Make a fake porteur de projet
    const bogusEmail = 'bogus@email.com'
    await Promise.all(
      [
        makeCredentials({
          hash: 'fakeHash',
          email: bogusEmail,
          userId: fakeUserId,
        }),
      ]
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())
        .map(credentialsRepo.insert)
    )

    await Promise.all(
      [
        makeFakeProject({
          classe: 'Eliminé',
          notifiedOn: new Date().getTime(),
          appelOffreId: appelOffre.id,
          periodeId: periode.id,
        }),
        makeFakeProject({
          classe: 'Classé',
          notifiedOn: new Date().getTime(),
          appelOffreId: appelOffre.id,
          periodeId: periode.id,
        }),
        makeFakeProject({
          appelOffreId: 'other',
          periodeId: 'otherother',
          notifiedOn: 0,
        }),
        makeFakeProject({
          classe: 'Eliminé',
          notifiedOn: 0,
          email: bogusEmail,
          nomProjet: fakeUserProjectName,
          appelOffreId: appelOffre.id,
          periodeId: periode.id,
        }),
        makeFakeProject({
          classe: 'Classé',
          notifiedOn: 0,
          email: bogusEmail,
          nomProjet: fakeUserProjectName,
          appelOffreId: appelOffre.id,
          periodeId: periode.id,
        }),
        makeFakeProject({
          classe: 'Classé',
          notifiedOn: 0,
          email: 'otheremail@test.com',
          appelOffreId: appelOffre.id,
          periodeId: periode.id,
        }),
      ]
        .map(makeProject)
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())
        .map(projectRepo.insert)
    )

    const allProjects = await projectRepo.findAll()

    expect(allProjects).toHaveLength(6)

    // Send new notifications
    const result = await sendAllCandidateNotifications({
      appelOffreId: appelOffre.id,
      periodeId: periode.id,
    })
    expect(result.is_ok()).toBeTruthy()
  })

  it('should create a notification for every project that has none', async () => {
    const recentNotifs = await candidateNotificationRepo.findAll()

    expect(recentNotifs).toBeDefined()
    expect(recentNotifs).toHaveLength(3)
  })

  it('should update every project as having been notified', async () => {
    const unNotifiedProjects = await projectRepo.findAll({
      appelOffreId: appelOffre.id,
      periodeId: periode.id,
      notifiedOn: 0,
    })

    expect(unNotifiedProjects).toHaveLength(0)
  })

  it('should send a notification to each email that is concerned', async () => {
    const allNotifs = getCallsToEmailStub()

    expect(allNotifs).toHaveLength(2)
  })

  it('should add the projects to the existing users if emails are the same', async () => {
    const userProjects = await projectRepo.findByUser(fakeUserId)

    expect(userProjects).toBeDefined()
    expect(userProjects).toHaveLength(2)
    expect(userProjects[0].nomProjet).toEqual(fakeUserProjectName)
  })
})
