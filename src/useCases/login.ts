import { User } from '../entities'

export default function makeLogin({ credentialsAccess, userAccess, hashFn }) {
  return async function login({
    email,
    password
  }: {
    email: string
    password: string
  }): Promise<User> {
    const credentials = await credentialsAccess.findByEmail({ email })

    // Email not found
    if (!credentials) return null

    // Check password
    if (hashFn(password) !== credentials.hash) return null

    const user = await userAccess.findById({ id: credentials.userId })

    if (!user) {
      throw new Error('Cannot find user corresponding to credentials userId')
    }

    return user
  }
}
