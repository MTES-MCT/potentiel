import isEmail from 'isemail'
import {
  String,
  Number,
  Record,
  Union,
  Literal,
  Boolean,
  Static,
  Unknown,
  Undefined,
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'
import { DREAL } from './dreal'

const userSchema = Record({
  id: String,
  fullName: String,
  email: String.withConstraint(isEmail.validate),
  role: Union(
    Literal('admin'),
    Literal('dgec'),
    Literal('porteur-projet'),
    Literal('dreal')
  ),
})

const fields: string[] = ['dreals', ...Object.keys(userSchema.fields)]

type User = Static<typeof userSchema>

interface MakeUserDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeUserDependencies) =>
  buildMakeEntity<User>(userSchema, makeId, fields)

export { User, userSchema }
