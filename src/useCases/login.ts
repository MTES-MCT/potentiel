import { CredentialsRepo, UserRepo } from '../dataAccess'
import { makeCredentials, User } from '../entities'
import { ErrorResult, Ok, ResultAsync } from '../types'

interface MakeLoginProps {
  credentialsRepo: CredentialsRepo
  userRepo: UserRepo
}

interface LoginProps {
  email: string
  password: string
}

export const ERREUR_USER_INCONNU = 'Aucun utilisateur avec cet email'
export const ERREUR_MOT_DE_PASSE_ERRONE = 'Mot de passe erroné'
export const ERREUR_GRAVE = 'Erreur système merci de bien vouloir réessayer'

export default function makeLogin({ credentialsRepo, userRepo }: MakeLoginProps) {
  return async function login({ email, password }: LoginProps): ResultAsync<User> {
    const credentials = await credentialsRepo.findByEmail(email.toLowerCase())

    // Email not found
    if (credentials.is_none()) {
      return ErrorResult(ERREUR_USER_INCONNU)
    }

    // Check password
    const providedCredentialsResult = makeCredentials({
      email,
      password,
      userId: '',
    })

    if (providedCredentialsResult.is_err()) {
      console.log(
        'login use-case: makeCredentials est en erreur',
        providedCredentialsResult.unwrap_err()
      )
      return ErrorResult(ERREUR_GRAVE)
    }

    const providedCredentials = providedCredentialsResult.unwrap()

    if (providedCredentials.hash !== credentials.unwrap().hash) {
      // console.log('login() : wrong password')
      return ErrorResult(ERREUR_MOT_DE_PASSE_ERRONE)
    }

    const userResult = await userRepo.findById(credentials.unwrap().userId)

    if (userResult.is_none()) {
      console.log(
        'login use-case: user avec le userId contenu dans les credentials est introuvable'
      )
      return ErrorResult(ERREUR_GRAVE)
    }

    // console.log('login() : all good, user is ', user)

    return Ok(userResult.unwrap())
  }
}
