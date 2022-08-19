import isEmail from 'isemail'
import buildMakeEntity from '../helpers/buildMakeEntity'
import { Literal, Null, Optional, Record, Static, String, Union } from '../types/schemaTypes'

const userSchema = Record({
  id: String,
  fullName: String,
  email: String.withConstraint(isEmail.validate),
  fonction: Optional(String.Or(Null)),
  role: Union(
    Literal('admin'),
    Literal('porteur-projet'),
    Literal('dreal'),
    Literal('acheteur-obligé'),
    Literal('ademe'),
    Literal('dgec-validateur')
  ),
})

const fields: string[] = [...Object.keys(userSchema.fields)]

type User = Static<typeof userSchema>

interface MakeUserDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeUserDependencies) =>
  buildMakeEntity<User>(userSchema, makeId, fields)

export { User, userSchema }
