import { User, makeCredentials } from '../entities'
import { UserRepo, CredentialsRepo } from '../dataAccess'

interface MakeLoginProps {
  credentialsRepo: CredentialsRepo
  userRepo: UserRepo
}

interface LoginProps {
  email: string
  password: string
}

export default function makeLogin({
  credentialsRepo,
  userRepo
}: MakeLoginProps) {
  return async function login({
    email,
    password
  }: LoginProps): Promise<User | null> {
    const credentials = await credentialsRepo.findByEmail({ email })

    // Email not found
    if (!credentials) return null

    // Check password
    const providedCredentials = makeCredentials({ email, password, userId: '' })
    if (providedCredentials.hash !== credentials.hash) return null

    const user = await userRepo.findById(credentials.userId)

    if (!user) {
      // console.log('userId is ', credentials.userId)
      throw new Error('Cannot find user corresponding to credentials userId')
    }

    return user
  }
}
