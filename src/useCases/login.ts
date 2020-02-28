import { User } from '../entities'
import { UserRepo, CredentialsRepo } from '../dataAccess'

interface MakeLoginProps {
  credentialsRepo: CredentialsRepo
  userRepo: UserRepo
  hashFn: (password: string) => string
}

interface LoginProps {
  email: string
  password: string
}

export default function makeLogin({
  credentialsRepo,
  userRepo,
  hashFn
}: MakeLoginProps) {
  return async function login({ email, password }: LoginProps): Promise<User> {
    const credentials = await credentialsRepo.findByEmail({ email })

    // Email not found
    if (!credentials) return null

    // Check password
    if (hashFn(password) !== credentials.hash) return null

    const user = await userRepo.findById({ id: credentials.userId })

    if (!user) {
      throw new Error('Cannot find user corresponding to credentials userId')
    }

    return user
  }
}
