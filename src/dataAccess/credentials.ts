import { makeCredentials, Credentials } from '../entities'

export type CredentialsRepo = {
  findByEmail: ({ email: string }) => Promise<Credentials>
  insert: (credentials: Credentials) => Promise<void>
}

interface MakeCredentialsRepoProps {
  isDbReady: Promise<void>
  credentialsDb: any
}

export default function makeCredentialsRepo({
  isDbReady,
  credentialsDb
}: MakeCredentialsRepoProps): CredentialsRepo {
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

    await credentialsDb.create(credentials)
  }
}
