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
    // MakeCredentialsProps definition prevents omission of required fields
    return {
      email,
      hash: hash || hashFn(password),
      userId
    }
  }
}
