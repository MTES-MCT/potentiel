import { User, makeUser, makeCredentials, DREAL } from '../entities'
import { UserRepo, CredentialsRepo, ProjectAdmissionKeyRepo } from '../dataAccess'

import { ResultAsync, ErrorResult, Ok } from '../types'
import { logger } from '../core/utils'

interface MakeUseCaseProps {
  userRepo: UserRepo
  addUserToProjectsWithEmail: UserRepo['addUserToProjectsWithEmail']
  addUserToProject: UserRepo['addProject']
  credentialsRepo: CredentialsRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
}

interface CallUseCaseProps {
  projectAdmissionKey: string
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export const PASSWORD_MISMATCH_ERROR = 'Les mots de passe ne correspondent pas.'
export const SYSTEM_ERROR = 'Votre compte ne peut pas être créé, merci de réessayer ultérieurement.'
export const EMAIL_USED_ERROR = 'Email déjà utilisé pour un autre compte'
export const PASSWORD_INVALID_ERROR = "Le mot de passe n'est pas suffisant"
export const USER_INFO_ERROR = 'Nom manquant'
export const MISSING_ADMISSION_KEY_ERROR =
  'Vous ne pouvez vous inscrire que suite à une invitation reçue par mail.'

export default function makeSignup({
  userRepo,
  addUserToProjectsWithEmail,
  addUserToProject,
  credentialsRepo,
  projectAdmissionKeyRepo,
}: MakeUseCaseProps) {
  return async function signup({
    projectAdmissionKey,
    fullName,
    email,
    password,
    confirmPassword,
  }: CallUseCaseProps): ResultAsync<User> {
    // Check if passwords match
    if (!password || password !== confirmPassword) {
      return ErrorResult(PASSWORD_MISMATCH_ERROR)
    }

    // Check if project admission key is valid
    const projectAdmissionKeyResult = await projectAdmissionKeyRepo.findById(projectAdmissionKey)

    if (projectAdmissionKeyResult.is_none()) {
      logger.warning(`signup use-case: projectAdmissionKey was not found : ${projectAdmissionKey}`)
      return ErrorResult(MISSING_ADMISSION_KEY_ERROR)
    }

    const projectAdmissionKeyInstance = projectAdmissionKeyResult.unwrap()
    // If it's a dreal that has been invited, use the email coming from the props
    // Else use the email locaited in the projectAdmissionKey
    const emailToBeUsed = (projectAdmissionKeyInstance.dreal
      ? email
      : projectAdmissionKeyInstance.email
    ).toLowerCase()

    // Check if email is already used
    const existingCredential = await credentialsRepo.findByEmail(emailToBeUsed)
    if (existingCredential.is_some()) {
      return ErrorResult(EMAIL_USED_ERROR)
    }

    // Create a user object
    const userResult = makeUser({
      fullName,
      email: emailToBeUsed,
      role: projectAdmissionKeyInstance.dreal ? 'dreal' : 'porteur-projet',
      projectAdmissionKey: projectAdmissionKeyInstance.id,
    })
    if (userResult.is_err()) {
      logger.info(userResult.unwrap_err())
      return ErrorResult(USER_INFO_ERROR)
    }
    const user = userResult.unwrap()

    // Create the credentials
    const credentialsData = {
      email: emailToBeUsed,
      userId: user.id,
      password,
    }
    const credentialsResult = makeCredentials(credentialsData)

    if (credentialsResult.is_err()) {
      logger.error(credentialsResult.unwrap_err())
      return ErrorResult(SYSTEM_ERROR)
    }

    const credentials = credentialsResult.unwrap()

    // Insert the user in the database
    const userInsertion = await userRepo.insert(user)

    if (userInsertion.is_err()) {
      logger.error(userInsertion.unwrap_err())
      return ErrorResult(SYSTEM_ERROR)
    }

    const credentialsInsertion = await credentialsRepo.insert(credentials)

    if (credentialsInsertion.is_err()) {
      logger.error(credentialsInsertion.unwrap_err())

      // Rollback: Remove the user from the database
      await userRepo.remove(user.id)

      return ErrorResult(SYSTEM_ERROR)
    }

    // Register the usage of the projectAdmissionKey
    projectAdmissionKeyInstance.lastUsedAt = Date.now()
    const projectAdmissionKeyUpdateRes = await projectAdmissionKeyRepo.save(
      projectAdmissionKeyInstance
    )

    if (projectAdmissionKeyUpdateRes.is_err()) {
      logger.error(projectAdmissionKeyUpdateRes.unwrap_err())
    }

    if (projectAdmissionKeyInstance.dreal) {
      // Dreal user
      // Add user to this dreal
      const addDrealResult = await userRepo.addToDreal(
        user.id,
        projectAdmissionKeyInstance.dreal as DREAL
      )

      if (addDrealResult.is_err()) {
        logger.error(addDrealResult.unwrap_err())
      }
    } else {
      // Porteur-projet user
      // User validated his email address by registering with it

      // Add all projects that have that email
      await addUserToProjectsWithEmail(user.id, projectAdmissionKeyInstance.email)

      // Add all projects that have a projectAdmissionKey for the same email
      const projectAdmissionKeysWithSameEmail = await projectAdmissionKeyRepo.findAll({
        email: projectAdmissionKeyInstance.email,
      })
      await Promise.all(
        projectAdmissionKeysWithSameEmail.map((projectAdmissionKey) =>
          projectAdmissionKey.projectId
            ? addUserToProject(user.id, projectAdmissionKey.projectId)
            : undefined
        )
      )
    }

    return Ok(user)
  }
}
