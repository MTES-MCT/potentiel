import makeRelanceInvitations from './relanceInvitations'
import makeSendNotification from './sendNotification'

import { makeProjectAdmissionKey, ProjectAdmissionKey } from '../entities'

import routes from '../routes'

import {
  projectAdmissionKeyRepo,
  notificationRepo,
  resetDatabase,
} from '../dataAccess/inMemory'

import {
  sendEmail,
  resetEmailStub,
  getCallsToEmailStub,
} from '../__tests__/fixtures/emailService'

const sendNotification = makeSendNotification({
  notificationRepo,
  sendEmail,
})

const relanceInvitations = makeRelanceInvitations({
  projectAdmissionKeyRepo,
  sendNotification,
})

describe('relanceInvitations use-case', () => {
  let projectAdmissionKeyForUser1: ProjectAdmissionKey
  beforeAll(async () => {
    resetDatabase()
    resetEmailStub()

    const [projectAdmissionKey] = (
      await Promise.all(
        [
          {
            email: 'pp-unused1@test.com',
            fullName: 'pp-unused1',
            lastUsedAt: 0,
          },
          {
            email: 'pp-unused2@test.com',
            fullName: '',
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

    expect(projectAdmissionKey).toBeDefined()
    if (!projectAdmissionKey) return

    // expect(projectAdmissionKeys).toHaveLength(5)

    // if (!projectAdmissionKeys.length) return

    projectAdmissionKeyForUser1 = projectAdmissionKey

    const res = await relanceInvitations({})
    expect(res.is_ok()).toEqual(true)
    expect(res.unwrap()).toEqual(2)
  })

  it('should create a new projectAdmissionKey and set lastUsedAt of the previous projectAdmissionKey to the createdAt of the new one', async () => {
    // Verifiy new key creation
    const newProjectAdmissionKeys = await projectAdmissionKeyRepo.findAll({
      email: projectAdmissionKeyForUser1.email,
      lastUsedAt: 0,
    })

    expect(newProjectAdmissionKeys).toHaveLength(1)
    const [newProjectAdmissionKey] = newProjectAdmissionKeys
    if (!newProjectAdmissionKey) return
    expect(newProjectAdmissionKey.id).not.toEqual(
      projectAdmissionKeyForUser1.id
    )

    expect((newProjectAdmissionKey.createdAt || 0) / 1000).toBeCloseTo(
      Date.now() / 1000,
      0
    )

    const updatedOldProjectAdmissionKeyRes = await projectAdmissionKeyRepo.findById(
      projectAdmissionKeyForUser1.id
    )

    expect(updatedOldProjectAdmissionKeyRes.is_some()).toEqual(true)
    const updatedOldProjectAdmissionKey = updatedOldProjectAdmissionKeyRes.unwrap()
    if (!updatedOldProjectAdmissionKey) return

    expect(updatedOldProjectAdmissionKey.lastUsedAt).toEqual(
      newProjectAdmissionKey.createdAt
    )
  })

  it('should send an email notification to porteurs projets that have not used their invitation', async () => {
    const sentEmails = getCallsToEmailStub()

    expect(sentEmails).toHaveLength(2)

    const sentEmailForUser1 = sentEmails.find((email) =>
      email.recipients.some(
        (recipient) => recipient.email === 'pp-unused1@test.com'
      )
    )
    expect(sentEmailForUser1).toBeDefined()
    if (!sentEmailForUser1) return
    expect(sentEmailForUser1.templateId).toEqual(1417004)
    expect(sentEmailForUser1.recipients[0].name).toEqual('pp-unused1')
    expect(sentEmailForUser1.subject).toEqual("Résultats de l'appel d'offres")

    // The email should contain the new invitation key
    const newProjectAdmissionKeys = await projectAdmissionKeyRepo.findAll({
      email: projectAdmissionKeyForUser1.email,
      lastUsedAt: 0,
    })
    expect(newProjectAdmissionKeys).toHaveLength(1)
    const [newProjectAdmissionKey] = newProjectAdmissionKeys
    if (!newProjectAdmissionKey) return
    expect(sentEmailForUser1.variables.invitation_link).toContain(
      routes.PROJECT_INVITATION({
        projectAdmissionKey: newProjectAdmissionKey.id,
      })
    )

    // Also for the other unused invitation
    const sentEmailForUser2 = sentEmails.find((email) =>
      email.recipients.some(
        (recipient) => recipient.email === 'pp-unused2@test.com'
      )
    )
    expect(sentEmailForUser2).toBeDefined()
  })
})
