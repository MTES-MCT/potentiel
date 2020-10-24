import isEmail from 'isemail'
import { String, Record, Static, Partial } from '../types/schemaTypes'
import { Optional } from 'utility-types'
import buildMakeEntity from '../helpers/buildMakeEntity'

const baseCredentialsSchema = Record({
  id: String,
  email: String.withConstraint(isEmail.validate),
  userId: String,
})
const credentialsSchema = baseCredentialsSchema.And(
  Partial({ hash: String.withConstraint((value) => value.length >= 1) })
) // This catches the case where the hash function doesn't work or that no password has been set }))

const fields: string[] = ['hash', ...Object.keys(baseCredentialsSchema.fields)]

type Credentials = Static<typeof credentialsSchema>

interface MakeCredentialsDependencies {
  makeId: () => string
  hashFn: (password: string) => string
}

// Either a password or a hash (not both)
type MakeCredentialsProps = Optional<Credentials & { password?: string }, 'id'>

export default ({ makeId, hashFn }: MakeCredentialsDependencies) => {
  const makeEntity = buildMakeEntity<Credentials>(credentialsSchema, makeId, fields)
  // This is a little special
  // makeCredentials can accepts either a email/userId/hash coming from the db
  // or an email/userId/password coming from a user sign up form
  // This intermediate step creates the hash from the password

  return (props: MakeCredentialsProps) =>
    makeEntity({
      email: props.email,
      hash: props.hash || (props.password ? hashFn(props.password) : ''),
      userId: props.userId,
    })
}

export { Credentials }
