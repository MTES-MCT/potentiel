import { makeCredentials } from '../entities'

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

  async function findByEmail({ email: _email }): Promise<ENR.Credentials> {
    await isDbReady

    const credentials = await credentialsDb.findOne({
      where: { email: _email }
    })

    return credentials ? makeCredentials(credentials) : null
  }

  async function insert(credentials: ENR.Credentials) {
    await isDbReady

    return await credentialsDb.create(credentials)
  }
}
