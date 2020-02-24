export default function buildMakeCredentials({ hashFn }) {
  return function makeCredentials({
    email,
    password,
    hash,
    userId
  }: {
    email: string
    password?: string
    hash?: string
    userId: string
  }): ENR.Credentials {
    if (!email) {
      throw new Error('Credentials must have an email.')
    }
    if (!password && !hash) {
      throw new Error('Credentials must have a password or hash.')
    }
    if (!userId) {
      throw new Error('Credentials must have a userId.')
    }

    return {
      email,
      hash: hash || hashFn(password),
      userId
    }
  }
}
