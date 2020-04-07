import {
  appelOffreRepo,
  appelsOffreStatic,
  candidateNotificationRepo,
  projectAdmissionKeyRepo,
  projectRepo,
  resetDatabase
} from '../dataAccess/inMemory'
import { makeProject } from '../entities'
import makeFakeProject from '../__tests__/fixtures/project'
import makeSendCandidateNotification from './sendCandidateNotification'

import {
  resetEmailStub,
  sendEmailNotification,
  getCallsToEmailStub
} from '../__tests__/fixtures/emailNotificationService'

const sendCandidateNotification = makeSendCandidateNotification({
  projectRepo,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendEmailNotification
})

describe('sendCandidateNotification use-case', () => {
  const bogusEmail = 'bogus@email.com'
  const bogusName = 'Nom du candidat'
  const appelOffre = appelsOffreStatic[0]
  const periode = appelOffre.periodes[0]

  let projetLaureat
  let projetElimine

  beforeAll(async () => {
    resetDatabase()

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
            nomCandidat: bogusName
          }),
          makeFakeProject({
            classe: 'Eliminé',
            appelOffreId: appelOffre.id,
            periodeId: periode.id,
            email: bogusEmail,
            nomCandidat: bogusName
          })
        ]
          .map(makeProject)
          .filter(item => item.is_ok())
          .map(item => item.unwrap())
          .map(projectRepo.insert)
      )
    )
      .filter(item => item.is_ok())
      .map(item => item.unwrap())

    projetLaureat = insertedProjects[0]
    projetElimine = insertedProjects[1]

    expect(insertedProjects).toHaveLength(2)
  })

  it('should call the email service with the project details and the correct template hen project is Classé', async () => {
    // Reset email stub
    resetEmailStub()

    // Send new notification
    const result = await sendCandidateNotification({
      projectId: projetLaureat.id
    })
    expect(result.is_ok()).toBeTruthy()

    expect(getCallsToEmailStub()).toHaveLength(1)

    const sentEmail = getCallsToEmailStub()[0]

    expect(sentEmail.destinationEmail).toEqual(bogusEmail)
    expect(sentEmail.destinationName).toEqual(bogusName)
    expect(sentEmail.subject).toContain(periode.title)
    expect(sentEmail.subject).toContain(appelOffre.shortTitle)
    expect(sentEmail.template).toEqual('lauréat')
    expect(sentEmail.subject.indexOf('Lauréats')).toEqual(0)
  })

  it('should call the email service with the project details and the correct template when project is Eliminé', async () => {
    // Reset email stub
    resetEmailStub()

    // Send new notification
    const result = await sendCandidateNotification({
      projectId: projetElimine.id
    })
    expect(result.is_ok()).toBeTruthy()

    expect(getCallsToEmailStub()).toHaveLength(1)

    const sentEmail = getCallsToEmailStub()[0]

    expect(sentEmail.destinationEmail).toEqual(bogusEmail)
    expect(sentEmail.destinationName).toEqual(bogusName)
    expect(sentEmail.subject).toContain(periode.title)
    expect(sentEmail.subject).toContain(appelOffre.shortTitle)
    expect(sentEmail.template).toEqual('eliminé')
    expect(sentEmail.subject.indexOf('Offres non retenues')).toEqual(0)
  })

  it('should send the email to overrideDestinationEmail when provided', async () => {
    // Reset email stub
    resetEmailStub()

    // Send new notification
    const result = await sendCandidateNotification({
      projectId: projetLaureat.id,
      overrideDestinationEmail: 'other@email.com'
    })
    expect(result.is_ok()).toBeTruthy()

    expect(getCallsToEmailStub()).toHaveLength(1)

    const sentEmail = getCallsToEmailStub()[0]

    expect(sentEmail.destinationEmail).toEqual('other@email.com')
  })
})
