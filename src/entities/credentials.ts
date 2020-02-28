export type Credentials = {
  readonly email: string
  readonly hash: string
  readonly userId: string
}

interface BuildMakeCredentialsProps {
  hashFn: (password: string) => string
}

type EmailAndUserId = {
  email: string
  userId: string
}

// Either a password or a hash (not both)
type MakeCredentialsProps = EmailAndUserId &
  (
    | { password: string; hash?: undefined }
    | { hash: string; password?: undefined }
  )

export default function buildMakeCredentials({
  hashFn
}: BuildMakeCredentialsProps) {
  return function makeCredentials({
    email,
    password,
    hash,
    userId
  }: MakeCredentialsProps): Credentials {
    if (!password && !hash) {
      throw new Error('Credentials must have a password or hash.')
    }

    return {
      email,
      hash: hash || hashFn(password),
      userId
    }
  }
}
