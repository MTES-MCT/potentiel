import { makeCredentials, Credentials } from '../entities'

export default function makeCredentialsAccess({
  isDbReady,
  credentialsDb
}: {
  isDbReady: Promise<void>
  credentialsDb: any
}) {
  return Object.freeze({
    findByEmail,
    insert
  })

  async function findByEmail({ email: _email }): Promise<Credentials> {
    await isDbReady

    const credentials = await credentialsDb.findOne({
      where: { email: _email }
    })

    return credentials ? makeCredentials(credentials) : null
  }

  async function insert(credentials: Credentials) {
    await isDbReady

    return await credentialsDb.create(credentials)
  }
}
