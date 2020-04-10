import {
  User,
  makeUser,
  Credentials,
  makeCredentials,
  ProjectAdmissionKey,
  makeProjectAdmissionKey,
} from '../entities'
import {
  UserRepo,
  CredentialsRepo,
  ProjectAdmissionKeyRepo,
  ProjectRepo,
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
  projectAdmissionKey: string
  fullName: string
  // email: string
  password: string
  confirmPassword: string
}

export const PASSWORD_MISMATCH_ERROR = 'Les mots de passe ne correspondent pas.'
export const SYSTEM_ERROR =
  'Votre compte ne peut pas être créé, merci de réessayer ultérieurement.'
export const EMAIL_USED_ERROR = 'Email déjà utilisé pour un autre compte'
export const PASSWORD_INVALID_ERROR = "Le mot de passe n'est pas suffisant"
export const USER_INFO_ERROR = 'Nom manquant'
export const MISSING_ADMISSION_KEY_ERROR =
  'Vous ne pouvez vous inscrire que suite à une invitation reçue par mail.'

export default function makeSignup({
  userRepo,
  credentialsRepo,
  projectAdmissionKeyRepo,
  projectRepo,
}: MakeUseCaseProps) {
  return async function signup({
    projectAdmissionKey,
    fullName,
    // email,
    password,
    confirmPassword,
  }: CallUseCaseProps): ResultAsync<User> {
    // Check if passwords match
    if (!password || password !== confirmPassword) {
      return ErrorResult(PASSWORD_MISMATCH_ERROR)
    }

    const projectAdmissionKeyResult = await projectAdmissionKeyRepo.findById(
      projectAdmissionKey
    )

    if (projectAdmissionKeyResult.is_none()) {
      console.log(
        'signup use-case: projectAdmissionKey was not found ',
        projectAdmissionKey
      )
      return ErrorResult(MISSING_ADMISSION_KEY_ERROR)
    }

    const projectAdmissionKeyInstance = projectAdmissionKeyResult.unwrap()
    const email = projectAdmissionKeyInstance.email

    // Check if email is already used
    const existingCredential = await credentialsRepo.findByEmail(email)
    if (existingCredential.is_some()) {
      return ErrorResult(EMAIL_USED_ERROR)
    }

    // Create a user object
    const userResult = makeUser({
      fullName,
      email,
      role: 'porteur-projet',
    })
    if (userResult.is_err()) {
      console.log(
        'signup use-case: makeUser est en erreur',
        userResult.unwrap_err()
      )
      return ErrorResult(USER_INFO_ERROR)
    }
    const user = userResult.unwrap()

    // Create the credentials
    const credentialsData = {
      email,
      userId: user.id,
      password,
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

      // Rollback: Remove the user from the database
      await userRepo.remove(user.id)

      return ErrorResult(SYSTEM_ERROR)
    }

    // User validated his email address by registering with it
    // Add all projects that have that email
    const projectsWithSameEmail = await projectRepo.findAll({ email })
    await Promise.all(
      projectsWithSameEmail.map((project) =>
        userRepo.addProject(user.id, project.id)
      )
    )

    return Ok(user)
  }
}
