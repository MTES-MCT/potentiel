import {
  User,
  makeUser,
  Credentials,
  makeCredentials,
  ProjectAdmissionKey,
  makeProjectAdmissionKey
} from '../entities'
import {
  UserRepo,
  CredentialsRepo,
  ProjectAdmissionKeyRepo,
  ProjectRepo
} from '../dataAccess'
import _ from 'lodash'

import { ResultAsync, ErrorResult, Ok } from '../types'

interface MakeUseCaseProps {
  userRepo: UserRepo
  credentialsRepo: CredentialsRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {
  projectId?: string
  projectAdmissionKey?: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export const PASSWORD_MISMATCH_ERROR = 'Les mots de passe ne correspondent pas.'
export const SYSTEM_ERROR =
  'Votre compte ne peut pas être créé, merci de réessayer ultérieurement.'
export const EMAIL_USED_ERROR = 'Email déjà utilisé pour un autre compte'
export const PASSWORD_INVALID_ERROR = "Le mot de passe n'est pas suffisant"
export const USER_INFO_ERROR = 'Prénom ou nom manquants'

export default function makeSignup({
  userRepo,
  credentialsRepo,
  projectAdmissionKeyRepo,
  projectRepo
}: MakeUseCaseProps) {
  return async function signup({
    projectId,
    projectAdmissionKey,
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  }: CallUseCaseProps): ResultAsync<User> {
    // Check if passwords match
    if (!password || password !== confirmPassword) {
      return ErrorResult(PASSWORD_MISMATCH_ERROR)
    }

    // Check if email is already used
    const existingCredential = await credentialsRepo.findByEmail(email)

    if (existingCredential.is_some()) {
      return ErrorResult(EMAIL_USED_ERROR)
    }

    // Create a user object
    const userResult = makeUser({
      firstName,
      lastName,
      role: 'porteur-projet'
    })

    if (userResult.is_err()) {
      console.log(
        'signup use-case: makeUser est en erreur',
        userResult.unwrap_err()
      )
      return ErrorResult(USER_INFO_ERROR)
    }

    const user = userResult.unwrap()

    const credentialsData = {
      email,
      userId: user.id,
      password
    }
    const credentialsResult = makeCredentials(credentialsData)

    if (credentialsResult.is_err()) {
      console.log(
        'signup use-case: makeCredentials est en erreur',
        credentialsResult.unwrap_err(),
        credentialsData
      )
      return ErrorResult(SYSTEM_ERROR)
    }

    const credentials = credentialsResult.unwrap()

    // Insert the user in the database
    const userInsertion = await userRepo.insert(user)

    if (userInsertion.is_err()) {
      console.log(
        'signup use-case: userRepo.insert est en erreur',
        userInsertion.unwrap_err(),
        user
      )
      return ErrorResult(SYSTEM_ERROR)
    }

    const credentialsInsertion = await credentialsRepo.insert(credentials)

    if (credentialsInsertion.is_err()) {
      console.log(
        'signup use-case: credentialsRepo.insert est en erreur',
        credentialsInsertion.unwrap_err(),
        credentials
      )

      // Remove the user from the database
      await userRepo.remove(user.id)

      return ErrorResult(SYSTEM_ERROR)
    }

    // Handle the case where the project has an admission key and projectId
    // Ignore the cases where there's one and not the other
    if (projectAdmissionKey && projectId) {
      const projectAdmissionKeyResult = await projectAdmissionKeyRepo.findById(
        projectAdmissionKey
      )

      if (projectAdmissionKeyResult.is_some()) {
        const projectAdmissionKeyInstance = projectAdmissionKeyResult.unwrap()
        if (projectAdmissionKeyInstance.projectId === projectId) {
          // User provided a correct projectAdmissionKey and projectId pair
          if (email === projectAdmissionKeyInstance.email) {
            // User validated his email address by registering with it
            // Add all projects that have that email
            const projectsWithSameEmail = await projectRepo.findAll({ email })
            await Promise.all(
              projectsWithSameEmail.map(project =>
                userRepo.addProject(user.id, project.id)
              )
            )
          } else {
            // User used another email address
            // Only link the user with the project from the admisssion key
            await userRepo.addProject(user.id, projectId)
          }
        }
      } else {
        console.log(
          'signup use-case: user provided projectAdmissionKey and projectId but projectAdmissionKey was not found ',
          credentials
        )
      }
    }

    return Ok(user)
  }
}
