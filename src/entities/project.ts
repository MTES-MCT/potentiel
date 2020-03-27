import isEmail from 'isemail'
import {
  String,
  Number,
  Record,
  Array,
  Union,
  Literal,
  Boolean,
  Static,
  Unknown,
  Partial,
  Undefined
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

import { candidateNotificationSchema } from './candidateNotification'

const baseProjectSchema = Record({
  id: String,
  periode: String,
  numeroCRE: String,
  famille: String,
  nomCandidat: String,
  nomProjet: String,
  puissance: Number.withConstraint(value => value > 0),
  prixReference: Number.withConstraint(value => value > 0),
  evaluationCarbone: Number.withConstraint(value => value > 0),
  note: Number.withConstraint(value => value >= 0),
  nomRepresentantLegal: String,
  email: String.withConstraint(isEmail.validate),
  adresseProjet: String,
  codePostalProjet: String,
  communeProjet: String,
  departementProjet: String,
  regionProjet: String,
  fournisseur: String,
  actionnaire: String,
  producteur: String,
  classe: Union(Literal('Eliminé'), Literal('Classé')),
  motifsElimination: String,
  notifiedOn: Number
})
const projectSchema = baseProjectSchema.And(
  Partial({
    candidateNotifications: Array(candidateNotificationSchema).Or(Undefined)
  })
)

const fields: string[] = [
  'candidateNotifications',
  ...Object.keys(baseProjectSchema.fields)
]

type Project = Static<typeof projectSchema>

interface MakeProjectDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeProjectDependencies) =>
  buildMakeEntity<Project>(projectSchema, makeId, fields, {
    notifiedOn: 0
  })

export { Project, projectSchema }
