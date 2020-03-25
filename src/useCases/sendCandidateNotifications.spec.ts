import makeSendCandidateNotifications from './sendCandidateNotifications'

import {
  projectRepo,
  candidateNotificationRepo,
  credentialsRepo,
  userRepo,
  projectAdmissionKeyRepo,
  resetDatabase
} from '../dataAccess/inMemory'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeCandidateNotification from '../__tests__/fixtures/candidateNotification'
import makeFakeUser from '../__tests__/fixtures/user'
import { PORTEUR_PROJET } from '../__tests__/fixtures/testCredentials'

import {
  makeUser,
  User,
  makeCredentials,
  makeProject,
  makeCandidateNotification
} from '../entities'

const sendCandidateNotifications = makeSendCandidateNotifications({
  projectRepo,
  userRepo,
  credentialsRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
})

describe('sendCandidateNotifications use-case', () => {
  let fakeUserId: User['id'] = 'fakeUserId'
  const fakeUserProjectName = 'fakeProjectName'

  beforeAll(async () => {
    resetDatabase()

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
          userId: fakeUserId
        })
      ]
        .filter(item => item.is_ok())
        .map(item => item.unwrap())
        .map(credentialsRepo.insert)
    )

    await Promise.all(
      [
        makeFakeProject({
          classe: 'Eliminé',
          notifiedOn: new Date().getTime()
        }),
        makeFakeProject({
          classe: 'Classé',
          notifiedOn: new Date().getTime()
        }),
        makeFakeProject({
          classe: 'Eliminé',
          email: bogusEmail,
          nomProjet: fakeUserProjectName
        }),
        makeFakeProject({ classe: 'Classé' })
      ]
        .map(makeProject)
        .filter(item => item.is_ok())
        .map(item => item.unwrap())
        .map(projectRepo.insert)
    )

    const allProjects = await projectRepo.findAll()

    // For the first two, create a notification
    // Insert these notifications in the repo
    await Promise.all(
      [
        makeFakeCandidateNotification({
          projectId: allProjects[0].id,
          template: 'elimination'
        }),
        makeFakeCandidateNotification({
          projectId: allProjects[1].id,
          template: 'laureat'
        })
      ]
        .map(makeCandidateNotification)
        .filter(item => item.is_ok())
        .map(item => item.unwrap())
        .map(candidateNotificationRepo.insert)
    )

    const priorNotifs = await candidateNotificationRepo.findAll()
    expect(priorNotifs).toHaveLength(2)

    // Send new notifications
    const result = await sendCandidateNotifications({})
    expect(result.is_ok()).toBeTruthy()
  })

  it('should create a notification for every project that has none', async () => {
    const recentNotifs = await candidateNotificationRepo.findAll()

    expect(recentNotifs).toBeDefined()
    expect(recentNotifs).toHaveLength(4)
  })

  it('should update every project as having been notified', async () => {
    const unNotifiedProjects = await projectRepo.findAll({
      notifiedOn: 0
    })

    expect(unNotifiedProjects).toHaveLength(0)
  })

  it('should send a notification with the right template', async () => {
    const allNotifs = await candidateNotificationRepo.findAll()

    expect(allNotifs).toHaveLength(4)

    await Promise.all(
      allNotifs.map(async notif => {
        const projectResult = await projectRepo.findById(notif.projectId)
        expect(projectResult.is_some())

        const project = projectResult.unwrap()

        if (project.classe === 'Classé') {
          expect(notif.template).toEqual('laureat')
        }

        if (project.classe === 'Eliminé') {
          expect(notif.template).toEqual('elimination')
        }
      })
    )
  })

  it('should add the projects to the existing users if emails are the same', async () => {
    const userProjects = await projectRepo.findByUser(fakeUserId)

    expect(userProjects).toBeDefined()
    expect(userProjects).toHaveLength(1)
    expect(userProjects[0].nomProjet).toEqual(fakeUserProjectName)
  })
})
