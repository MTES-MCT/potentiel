import {
  appelOffreRepo,
  appelsOffreStatic,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  projectRepo,
  resetDatabase,
  notificationRepo,
} from '../dataAccess/inMemory'
import { makeProject } from '../entities'
import makeFakeProject from '../__tests__/fixtures/project'
import makeSendCandidateNotification from './sendCandidateNotification'
import makeSendNotification from './sendNotification'
import routes from '../routes'

import {
  sendEmail,
  resetEmailStub,
  getCallsToEmailStub,
} from '../__tests__/fixtures/emailService'

const sendNotification = makeSendNotification({
  notificationRepo,
  sendEmail,
})

const sendCandidateNotification = makeSendCandidateNotification({
  projectRepo,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendNotification,
})

describe('sendCandidateNotification use-case', () => {
  const bogusEmail = 'bogus@email.com'
  const bogusName = 'Nom du candidat'
  const appelOffre = appelsOffreStatic[0]
  const periode = appelOffre.periodes[0]

  let projetLaureat
  let projetElimine

  beforeEach(async () => {
    resetDatabase()
    resetEmailStub()

    const previousNotifs = await candidateNotificationRepo.findAll()
    expect(previousNotifs).toBeDefined()
    expect(previousNotifs).toHaveLength(0)

    const insertedProjects = (
      await Promise.all(
        [
          makeFakeProject({
            classe: 'Classé',
            appelOffreId: appelOffre.id,
            periodeId: periode.id,
            email: bogusEmail,
            nomRepresentantLegal: bogusName,
          }),
          makeFakeProject({
            classe: 'Eliminé',
            appelOffreId: appelOffre.id,
            periodeId: periode.id,
            email: bogusEmail,
            nomRepresentantLegal: bogusName,
          }),
        ]
          .map(makeProject)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(projectRepo.save)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    projetLaureat = insertedProjects[0]
    projetElimine = insertedProjects[1]

    expect(insertedProjects).toHaveLength(2)
  })

  it("should call the email service with the user and appel d'offre details", async () => {
    // Send new notification
    const result = await sendCandidateNotification({
      email: bogusEmail,
      appelOffreId: appelOffre.id,
      periodeId: periode.id,
    })
    expect(result.is_ok()).toBeTruthy()

    expect(getCallsToEmailStub()).toHaveLength(1)

    const sentEmail = getCallsToEmailStub()[0]

    expect(sentEmail.recipients).toHaveLength(1)
    expect(sentEmail.recipients[0].email).toEqual(bogusEmail)
    expect(sentEmail.recipients[0].name).toEqual(bogusName)
    expect(sentEmail.subject).toContain(periode.title)
    expect(sentEmail.subject).toContain(appelOffre.shortTitle)
    expect(sentEmail.templateId).toEqual(1350523)
    expect(sentEmail.variables.invitation_link).toContain(
      routes.PROJECT_INVITATION()
    )
  })

  it('should send the email to overrideDestinationEmail when provided', async () => {
    // Send new notification
    const result = await sendCandidateNotification({
      email: bogusEmail,
      appelOffreId: appelOffre.id,
      periodeId: periode.id,
      overrideDestinationEmail: 'other@email.com',
    })
    expect(result.is_ok()).toBeTruthy()

    expect(getCallsToEmailStub()).toHaveLength(1)

    const sentEmail = getCallsToEmailStub()[0]

    expect(sentEmail.recipients).toHaveLength(1)
    expect(sentEmail.recipients[0].email).toEqual('other@email.com')
  })
})
