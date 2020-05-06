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
  Undefined,
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

import { candidateNotificationSchema } from './candidateNotification'
import { appelOffreSchema } from './appelOffre'

const territoireSchema = Union(
  Literal('Corse'),
  Literal('Guadeloupe'),
  Literal('Guyane'),
  Literal('La Réunion'),
  Literal('Mayotte'),
  Literal('Martinique')
)

const baseProjectSchema = Record({
  id: String,
  appelOffreId: String,
  periodeId: String,
  numeroCRE: String,
  familleId: String,
  nomCandidat: String,
  nomProjet: String,
  puissance: Number.withConstraint((value) => value > 0),
  prixReference: Number.withConstraint((value) => value > 0),
  evaluationCarbone: Number,
  note: Number.withConstraint((value) => value >= 0),
  nomRepresentantLegal: String,
  isFinancementParticipatif: Boolean,
  isInvestissementParticipatif: Boolean,
  engagementFournitureDePuissanceAlaPointe: Boolean,
  email: String.withConstraint(isEmail.validate),
  adresseProjet: String,
  codePostalProjet: String,
  communeProjet: String,
  departementProjet: String,
  regionProjet: String,
  fournisseur: String,
  classe: Union(Literal('Eliminé'), Literal('Classé')),
  motifsElimination: String,
  notifiedOn: Number,
})
const projectSchema = baseProjectSchema.And(
  Partial({
    candidateNotifications: Array(candidateNotificationSchema).Or(Undefined),
    actionnaire: String,
    territoireProjet: territoireSchema.Or(Undefined),
    appelOffre: appelOffreSchema,
  })
)

const fields: string[] = [
  'candidateNotifications',
  'actionnaire',
  'territoireProjet',
  'appelOffre',
  ...Object.keys(baseProjectSchema.fields),
]

type Project = Static<typeof projectSchema>

interface MakeProjectDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeProjectDependencies) =>
  buildMakeEntity<Project>(projectSchema, makeId, fields, {
    notifiedOn: 0,
    isInvestissementParticipatif: false,
    isFinancementParticipatif: false,
    engagementFournitureDePuissanceAlaPointe: false,
  })

export { Project, projectSchema, territoireSchema }
