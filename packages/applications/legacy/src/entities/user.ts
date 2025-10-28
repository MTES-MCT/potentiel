import isEmail from 'isemail';
import buildMakeEntity from '../helpers/buildMakeEntity';
import { Literal, Optional, Record, Static, String, Undefined, Union } from '../types/schemaTypes';

const userSchema = Record({
  id: String,
  fullName: String,
  email: String.withConstraint(isEmail.validate),
  fonction: Optional(String.Or(Undefined)),
  role: Union(
    Literal('admin'),
    Literal('porteur-projet'),
    Literal('dreal'),
    Literal('cocontractant'),
    Literal('ademe'),
    Literal('dgec-validateur'),
    Literal('cre'),
    Literal('caisse-des-dépôts'),
    Literal('grd'),
  ),
});

const fields: string[] = [...Object.keys(userSchema.fields)];

type User = Static<typeof userSchema>;

interface MakeUserDependencies {
  makeId: () => string;
}

export default ({ makeId }: MakeUserDependencies) =>
  buildMakeEntity<User>(userSchema, makeId, fields);

export { User, userSchema };
