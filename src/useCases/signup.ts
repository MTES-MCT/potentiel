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
  credentialsRepo,
  projectAdmissionKeyRepo
} from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  userRepo: UserRepo
  credentialsRepo: CredentialsRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
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

export default function makeSignup({ userRepo }: MakeUseCaseProps) {
  return async function signup({
    projectId,
    projectAdmissionKey,
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  }: CallUseCaseProps): Promise<void> {
    // Check if passwords match
    if (!password || password !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas.')
    }

    // Create a user object
    let userId: string
    try {
      userId = await userRepo.insert(
        makeUser({ firstName, lastName, role: 'porteur-projet' })
      )
    } catch (e) {
      throw new Error('Prénom ou nom manquants')
    }

    // Create a credentials object
    try {
      const existingCredential = await credentialsRepo.findByEmail({ email })

      if (existingCredential) {
        throw new Error('Email déjà utilisé pour un autre compte')
      }

      await credentialsRepo.insert(makeCredentials({ email, userId, password }))
    } catch (e) {
      // TODO: delete user object
      throw new Error('Email erroné')
    }

    if (projectAdmissionKey) {
      if (!projectId) {
        throw new Error(
          'Impossible de lier ce compte utilisateur au projet associé.'
        )
      }

      const projectAdmissionKeyInstance = await projectAdmissionKeyRepo.findById(
        { id: projectAdmissionKey }
      )

      if (!projectAdmissionKeyInstance) {
        throw new Error('Lien de projet erroné')
      }

      if (projectAdmissionKeyInstance.projectId !== projectId) {
        throw new Error('Lien de projet erroné')
      }

      // Link the user and the project
      await userRepo.addProject(userId, projectId)

      // TODO: look for other projectAdmissionKeys that were sent to the same email ?
    }
  }
}
