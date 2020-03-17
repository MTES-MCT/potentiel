import { v1 as uuidv1 } from 'uuid'

import makeSendCandidateNotifications from './sendCandidateNotifications'

import {
  projectRepo,
  candidateNotificationRepo,
  credentialsRepo,
  userRepo
} from '../dataAccess/inMemory'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeCandidateNotification from '../__tests__/fixtures/candidateNotification'
import makeFakeUser from '../__tests__/fixtures/user'
import { PORTEUR_PROJET } from '../__tests__/fixtures/testCredentials'

import { makeUser, User } from '../entities'

const sendCandidateNotifications = makeSendCandidateNotifications({
  projectRepo,
  userRepo,
  credentialsRepo,
  makeUuid: uuidv1
})

describe('sendCandidateNotifications use-case', () => {
  let fakeUserId: User['id'] = 'fakeUserId'
  const fakeUserProjectName = 'fakeProjectName'

  beforeAll(async () => {
    const previousNotifs = await candidateNotificationRepo.findAll()
    expect(previousNotifs).toBeDefined()
    expect(previousNotifs).toHaveLength(0)

    // Make a fake porteur de projet
    const bogusEmail = 'bogus@email.com'
    await credentialsRepo.insert({
      hash: 'fakeHash',
      email: bogusEmail,
      userId: fakeUserId
    })

    await projectRepo.insertMany([
      makeFakeProject({ classe: 'Eliminé', hasBeenNotified: true }),
      makeFakeProject({ classe: 'Classé', hasBeenNotified: true }),
      makeFakeProject({
        classe: 'Eliminé',
        email: bogusEmail,
        nomProjet: fakeUserProjectName
      }),
      makeFakeProject({ classe: 'Classé' })
    ])

    const allProjects = await projectRepo.findAll()

    // For the first two, create a notification
    const fakePriorNotifs = [
      makeFakeCandidateNotification({
        projectId: allProjects[0].id,
        template: 'elimination'
      }),
      makeFakeCandidateNotification({
        projectId: allProjects[1].id,
        template: 'laureat'
      })
    ]
    // Insert these notifications in the repo
    await candidateNotificationRepo.insertMany(fakePriorNotifs)

    const priorNotifs = await candidateNotificationRepo.findAll()
    expect(priorNotifs).toHaveLength(2)

    // Send new notifications
    await sendCandidateNotifications({})
  })

  it('should create a notification for every project that has none', async () => {
    const recentNotifs = await candidateNotificationRepo.findAll()

    expect(recentNotifs).toBeDefined()
    expect(recentNotifs).toHaveLength(4)
  })

  it('should update every project as having been notified', async () => {
    const unNotifiedProjects = await projectRepo.findAll({
      hasBeenNotified: false
    })

    expect(unNotifiedProjects).toHaveLength(0)
  })

  it('should send a notification with the right template', async () => {
    const allNotifs = await candidateNotificationRepo.findAll()

    expect(allNotifs).toHaveLength(4)

    expect.assertions(allNotifs.length * 2 + 1)

    await Promise.all(
      allNotifs.map(async notif => {
        const project = await projectRepo.findById({ id: notif.projectId })
        expect(project).toBeDefined()

        if (project === null) return // To avoid compiler error below

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
    const userProjects = await userRepo.findProjects(fakeUserId)

    expect(userProjects).toBeDefined()
    expect(userProjects).toHaveLength(1)
    expect(userProjects[0].nomProjet).toEqual(fakeUserProjectName)
  })
})
