import {
  appelOffreRepo,
  userRepo,
  appelsOffreStatic,
  projectAdmissionKeyRepo,
  credentialsRepo,
  projectRepo,
  notificationRepo,
  resetDatabase,
} from '../dataAccess/inMemory'
import {
  makeProject,
  makeCredentials,
  makeUser,
  User,
  Project,
} from '../entities'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeInviteUserToProject, {
  ACCESS_DENIED_ERROR,
} from './inviteUserToProject'
import makeShouldUserAccessProject from './shouldUserAccessProject'
import routes from '../routes'
import makeSendNotification from './sendNotification'
import {
  sendEmail,
  resetEmailStub,
  getCallsToEmailStub,
} from '../__tests__/fixtures/emailService'

const sendNotification = makeSendNotification({
  notificationRepo,
  sendEmail,
})

const shouldUserAccessProject = makeShouldUserAccessProject({ userRepo })
const inviteUserToProject = makeInviteUserToProject({
  projectRepo,
  userRepo,
  projectAdmissionKeyRepo,
  credentialsRepo,
  shouldUserAccessProject,
  sendNotification,
})

describe('inviteUserToProject use-case', () => {
  const bogusEmail = 'bogus@email.com'
  const bogusName = 'Nom du candidat'
  const appelOffre = appelsOffreStatic[0]
  const periode = appelOffre.periodes[0]

  let projet: Project
  let user: User

  beforeEach(async () => {
    resetDatabase()
    resetEmailStub()

    // Create a fake project
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
    user = insertedUsers[0]
    if (!user) return

    // Link project to user
    const res = await userRepo.addProject(user.id, projet.id)
    expect(res.is_ok()).toBeTruthy()
  })

  it('should add project to invited user if the latter already has an account and notify them by email', async () => {
    const email = 'existing@user.test'

    // TODO : insert user as well
    const insertedUsers = (
      await Promise.all(
        [
          {
            email,
            fullName: 'test',
            role: 'porteur-projet',
          },
        ]
          .map(makeUser)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(userRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(insertedUsers).toHaveLength(1)
    const existingUser = insertedUsers[0]
    if (!existingUser) return

    const insertedCredentials = (
      await Promise.all(
        [
          {
            email,
            userId: existingUser.id,
            password: 'password',
          },
        ]
          .map(makeCredentials)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(credentialsRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(insertedCredentials).toHaveLength(1)

    const result = await inviteUserToProject({
      email,
      projectId: projet.id,
      user,
    })

    expect(result.is_ok()).toBeTruthy()

    // Make sure the user has been granted access to the project
    const userProjects = await projectRepo.findByUser(existingUser.id)
    expect(userProjects).toHaveLength(1)
    expect(userProjects[0].id).toEqual(projet.id)

    // Make sure the notification has been sent
    expect(getCallsToEmailStub()).toHaveLength(1)

    const sentEmail = getCallsToEmailStub()[0]

    expect(sentEmail.recipients[0].email).toEqual(email)
    expect(sentEmail.subject).toEqual(
      `${user.fullName} vous invite à suivre un projet sur Potentiel`
    )
    expect(sentEmail.variables.nomProjet).toEqual(projet.nomProjet)
    expect(sentEmail.variables.invitation_link).toContain(
      routes.PROJECT_DETAILS(projet.id)
    )
    expect(sentEmail.templateId).toEqual(1402576)
  })

  it('should send an invitation link to the invited user if he has not account yet', async () => {
    const email = 'non-existing@user.test'

    const result = await inviteUserToProject({
      email,
      projectId: projet.id,
      user,
    })

    expect(result.is_ok()).toBeTruthy()

    // Make sure a projectAdmissionKey has been created
    const projectAdmissionKeys = await projectAdmissionKeyRepo.findAll({
      projectId: projet.id,
      email,
    })
    expect(projectAdmissionKeys).toHaveLength(1)
    const projectAdmissionKey = projectAdmissionKeys[0].id

    // Make sure an invitation has been sent
    expect(getCallsToEmailStub()).toHaveLength(1)

    const sentEmail = getCallsToEmailStub()[0]

    expect(sentEmail.recipients[0].email).toEqual(email)
    expect(sentEmail.subject).toEqual(
      `${user.fullName} vous invite à suivre un projet sur Potentiel`
    )
    expect(sentEmail.variables.nomProjet).toEqual(projet.nomProjet)
    expect(sentEmail.variables.invitation_link).toContain(
      routes.PROJECT_INVITATION({
        projectAdmissionKey,
      })
    )
    expect(sentEmail.templateId).toEqual(1402576)
  })

  it('should return an error if the calling user doesnt have the right to this project', async () => {
    // Create another fake user
    const insertedUsers = (
      await Promise.all(
        [
          makeFakeUser({
            role: 'porteur-projet',
          }),
        ]
          .map(makeUser)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(userRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())
    expect(insertedUsers).toHaveLength(1)
    const otherUser = insertedUsers[0]

    if (!otherUser) return
    const result = await inviteUserToProject({
      email: 'test@test.test',
      projectId: projet.id,
      user: otherUser,
    })

    expect(result.is_err()).toBeTruthy()
    expect(result.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)
  })
})
