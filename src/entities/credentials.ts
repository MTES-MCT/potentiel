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
  ({ hash?: never; password: string } | { hash: string; password?: never })

export default function buildMakeCredentials({
  hashFn
}: BuildMakeCredentialsProps) {
  return function makeCredentials(props: MakeCredentialsProps): Credentials {
    // MakeCredentialsProps definition prevents omission of required fields
    return {
      email: props.email,
      hash: props.hash ?? hashFn(props.password),
      userId: props.userId
    }
  }
}
