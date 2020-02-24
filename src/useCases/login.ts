export default function makeLogin({ credentialsAccess, hashFn }) {
  return async function login({
    email,
    password
  }: {
    email: string
    password: string
  }) {
    const credentials = await credentialsAccess.findByEmail({ email })

    // Email not found
    if (!credentials) return null

    // Check password
    if (hashFn(password) !== credentials.hash) return null

    return credentials.userId
  }
}
