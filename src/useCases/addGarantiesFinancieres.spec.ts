import makeAddGarantiesFinancieres, {
  UNAUTHORIZED,
} from './addGarantiesFinancieres'
import makeShouldUserAccessProject from './shouldUserAccessProject'

import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'

import {
  makeProject,
  makeUser,
  User,
  Project,
  ProjectAdmissionKey,
} from '../entities'

import {
  projectRepo,
  userRepo,
  notificationRepo,
  resetDatabase,
  projectAdmissionKeyRepo,
} from '../dataAccess/inMemory'
import moment from 'moment'

import makeSendNotification from './sendNotification'
import {
  sendEmail,
  resetEmailStub,
  getCallsToEmailStub,
} from '../__tests__/fixtures/emailService'
import routes from '../routes'

const sendNotification = makeSendNotification({
  notificationRepo,
  sendEmail,
})

const shouldUserAccessProject = makeShouldUserAccessProject({
  userRepo,
  projectRepo,
})
const addGarantiesFinancieres = makeAddGarantiesFinancieres({
  userRepo,
  projectRepo,
  projectAdmissionKeyRepo,
  shouldUserAccessProject,
  sendNotification,
})

describe('addGarantiesFinancieres use-case', () => {
  let projet: Project
  let user: User

  beforeAll(async () => {
    resetDatabase()
    resetEmailStub()

    // Create a fake project
    const insertedProjects = (
      await Promise.all(
        [
          makeFakeProject({
            classe: 'Classé',
            notifiedOn: Date.now() - 40 * 24 * 3600 * 1000,
            regionProjet: 'Bretagne / Pays de la Loire',
            departementProjet: 'Loire-Atlantique',
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

    expect(insertedProjects).toHaveLength(1)
    if (!insertedProjects[0]) return
    projet = insertedProjects[0]
    if (!projet) return

    // Create a fake user
    const [porteurProjet, dreal1, dreal2, dreal4] = (
      await Promise.all(
        [
          { role: 'porteur-projet', email: 'porteur@test.test' },
          { role: 'dreal', email: 'dreal1@test.test' },
          { role: 'dreal', email: 'dreal2@test.test' },
          { role: 'dreal', email: 'dreal4@test.test' },
        ]
          .map(makeFakeUser)
          .map(makeUser)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(userRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(porteurProjet).toBeDefined()
    expect(dreal1).toBeDefined()
    expect(dreal2).toBeDefined()
    expect(dreal4).toBeDefined()
    if (!porteurProjet || !dreal1 || !dreal2 || !dreal4) return

    user = porteurProjet

    // Link project to user
    const res = await userRepo.addProject(user.id, projet.id)
    expect(res.is_ok()).toBeTruthy()

    // Link dreal users to dreal
    await userRepo.addToDreal(dreal1.id, 'Bretagne')
    await userRepo.addToDreal(dreal2.id, 'Pays de la Loire')
    // The next dreal user exists to _not_ receive a notification
    await userRepo.addToDreal(dreal4.id, 'Corse')

    // Simulate invitation to other dreal user
    await projectAdmissionKeyRepo.save({
      id: '1233',
      email: 'dreal3@test.test',
      fullName: 'dreal3',
      dreal: 'Bretagne',
    } as ProjectAdmissionKey)
    // This second invitation should be ignored because the user already has an account
    await projectAdmissionKeyRepo.save({
      id: '1234',
      email: 'dreal1@test.test',
      fullName: 'dreal1',
      dreal: 'Bretagne',
    } as ProjectAdmissionKey)
  })

  describe('successful call', () => {
    const filename = 'fakeFile.pdf'
    const date = Date.now()

    beforeAll(async () => {
      const res = await addGarantiesFinancieres({
        filename,
        date,
        projectId: projet.id,
        user,
      })

      expect(res.is_ok()).toBe(true)
      if (res.is_err()) return
    })

    it('should update the project garantiesFinancieres* properties', async () => {
      // Get the latest version of the project
      const updatedProjectRes = await projectRepo.findById(projet.id, true)

      expect(updatedProjectRes.is_some()).toBe(true)
      if (updatedProjectRes.is_none()) return

      const updatedProject = updatedProjectRes.unwrap()

      expect(updatedProject.garantiesFinancieresSubmittedOn / 100).toBeCloseTo(
        Date.now() / 100,
        0
      )
      expect(updatedProject.garantiesFinancieresSubmittedBy).toEqual(user.id)
      expect(updatedProject.garantiesFinancieresFile).toEqual(filename)
      expect(updatedProject.garantiesFinancieresDate).toEqual(date)

      expect(updatedProject.history).toHaveLength(1)
      if (!updatedProject.history?.length) return
      expect(updatedProject.history[0].before).toEqual({
        garantiesFinancieresSubmittedBy: '',
        garantiesFinancieresSubmittedOn: 0,
        garantiesFinancieresFile: '',
        garantiesFinancieresDate: 0,
      })
      expect(updatedProject.history[0].after).toEqual({
        garantiesFinancieresSubmittedBy: user.id,
        garantiesFinancieresSubmittedOn:
          updatedProject.garantiesFinancieresSubmittedOn,
        garantiesFinancieresFile: filename,
        garantiesFinancieresDate: date,
      })
      expect(updatedProject.history[0].createdAt / 100).toBeCloseTo(
        Date.now() / 100,
        0
      )
      expect(updatedProject.history[0].type).toEqual(
        'garanties-financieres-submission'
      )
      expect(updatedProject.history[0].userId).toEqual(user.id)
    })

    it('should send out email notifications', async () => {
      expect(getCallsToEmailStub()).toHaveLength(4)
    })

    it('should send an email confirmation to the user', async () => {
      // Make sure the notification has been sent
      const emailSentToUser = getCallsToEmailStub().find(
        (email) => email.recipients[0].email === user.email
      )

      expect(emailSentToUser).toBeDefined()
      if (!emailSentToUser) return
      expect(emailSentToUser.subject).toEqual(
        "Confirmation d'envoi des garanties financières"
      )
      expect(emailSentToUser.variables).toEqual({
        nomProjet: projet.nomProjet,
        dreal: projet.regionProjet,
        date_depot: moment(date).format('DD/MM/YYYY'),
      })
      expect(emailSentToUser.templateId).toEqual(1463065)
    })

    it('should send an email notification to dreal users from the projet region', async () => {
      // For this user, user filter instead of find to make sure only one email has been
      // sent to him (he has an invitation also)
      const emailsSentToDreal1 = getCallsToEmailStub().filter(
        (email) => email.recipients[0].email === 'dreal1@test.test'
      )

      expect(emailsSentToDreal1).toHaveLength(1)
      const emailSentToDreal1 = emailsSentToDreal1[0]

      expect(emailSentToDreal1).toBeDefined()
      if (!emailSentToDreal1) return

      expect(emailSentToDreal1.subject).toEqual(
        'Potentiel - Nouveau dépôt de garantie financière dans votre région, departement Loire-Atlantique'
      )

      expect(emailSentToDreal1.variables.nomProjet).toEqual(projet.nomProjet)
      expect(emailSentToDreal1.variables.invitation_link).toContain(
        routes.GARANTIES_FINANCIERES_LIST
      )

      expect(emailSentToDreal1.templateId).toEqual(1528696)

      const emailSentToDreal2 = getCallsToEmailStub().find(
        (email) => email.recipients[0].email === 'dreal2@test.test'
      )
      expect(emailSentToDreal2).toBeDefined()
      if (!emailSentToDreal2) return
      expect(emailSentToDreal2.subject).toEqual(
        'Potentiel - Nouveau dépôt de garantie financière dans votre région, departement Loire-Atlantique'
      )
      expect(emailSentToDreal2.variables.nomProjet).toEqual(projet.nomProjet)
      expect(emailSentToDreal2.variables.invitation_link).toContain(
        routes.GARANTIES_FINANCIERES_LIST
      )
      expect(emailSentToDreal2.templateId).toEqual(1528696)
    })

    it('should send en email notification to invited dreal users from the projet region', async () => {
      // Make sure the notification has been sent
      const emailSentToDreal3 = getCallsToEmailStub().find(
        (email) => email.recipients[0].email === 'dreal3@test.test'
      )
      expect(emailSentToDreal3).toBeDefined()
      if (!emailSentToDreal3) return
      expect(emailSentToDreal3.subject).toEqual(
        'Potentiel - Nouveau dépôt de garantie financière dans votre région, departement Loire-Atlantique'
      )
      expect(emailSentToDreal3.variables.nomProjet).toEqual(projet.nomProjet)
      expect(emailSentToDreal3.variables.invitation_link).toContain(
        routes.DREAL_INVITATION({
          projectAdmissionKey: '1233',
        })
      )
      expect(emailSentToDreal3.templateId).toEqual(1528696)
    })
  })

  it('should return an error if the user does not have the rights on this project', async () => {
    const filename = 'fakeFile.pdf'
    const date = Date.now()

    // Create another fake user
    const insertedUsers = (
      await Promise.all(
        [makeFakeUser({ role: 'porteur-projet' })]
          .map(makeUser)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(userRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())
    expect(insertedUsers).toHaveLength(1)
    if (!insertedUsers[0]) return
    const otherUser = insertedUsers[0]
    if (!otherUser) return

    const res = await addGarantiesFinancieres({
      filename,
      date,
      projectId: projet.id,
      user: otherUser,
    })

    expect(res.is_err()).toBe(true)
    if (res.is_ok()) return

    expect(res.unwrap_err()).toEqual(new Error(UNAUTHORIZED))
  })
})
