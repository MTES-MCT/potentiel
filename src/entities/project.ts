import isEmail from 'isemail'
import _ from 'lodash'
import {
  String,
  Number,
  Record as SchemaRecord,
  Array as SchemaArray,
  Union,
  Literal,
  Boolean,
  Static,
  Unknown,
  Partial as SchemaPartial,
  Undefined,
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'

import { User, ModificationRequest } from './'

import { appelOffreSchema } from './appelOffre'
import { familleSchema } from './famille'

const territoireSchema = Union(
  Literal('Corse'),
  Literal('Guadeloupe'),
  Literal('Guyane'),
  Literal('La Réunion'),
  Literal('Mayotte'),
  Literal('Martinique')
)

const baseProjectSchema = SchemaRecord({
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
  garantiesFinancieresSubmittedOn: Number,
  garantiesFinancieresSubmittedBy: String,
  garantiesFinancieresFile: String,
  garantiesFinancieresDate: Number,
})
const projectSchema = baseProjectSchema.And(
  SchemaPartial({
    actionnaire: String,
    territoireProjet: territoireSchema.Or(Undefined),
    appelOffre: appelOffreSchema,
    famille: familleSchema,
  })
)

const fields: string[] = [
  'actionnaire',
  'territoireProjet',
  'appelOffre',
  'history',
  'details',
  ...Object.keys(baseProjectSchema.fields),
]

type BaseProject = Static<typeof projectSchema> & {
  details?: Record<string, any>
}

type ProjectEvent = {
  id: string
  before: Partial<BaseProject>
  after: Partial<BaseProject>
  createdAt: number
  userId: User['id']
  type:
    | 'modification-request'
    | 'import'
    | 'candidate-notification'
    | 'garanties-financieres-submission'
  modificationRequestId?: ModificationRequest['id']
  isNew?: true
}

type Project = BaseProject & {
  history?: Array<ProjectEvent>
}

interface ApplyProjectUpdateProps {
  project: Project
  update?: Partial<BaseProject>
  context: {
    userId: User['id']
    type: ProjectEvent['type']
    modificationRequestId?: ModificationRequest['id']
  }
}
const buildApplyProjectUpdate = (makeId: () => string) => {
  return ({
    project,
    update,
    context,
  }: ApplyProjectUpdateProps): Project | null => {
    // Determine before/after values from the project and update
    const { before, after } = update
      ? Object.keys(update)
          .filter(
            (key) =>
              key !== 'id' &&
              // Only accept changes to notifiedOn for candidate-notifications
              (context.type === 'candidate-notification' ||
                key !== 'notifiedOn')
          )
          .reduce(
            ({ before, after }, key: string) => {
              if (project[key] && typeof project[key] === 'object') {
                // For objects, do a deep compare
                const changedKeys = [
                  ...Object.keys(project[key]),
                  ...Object.keys(update[key]),
                ].filter(
                  (innerKey) => project[key][innerKey] != update[key][innerKey]
                )

                if (changedKeys.length) {
                  before[key] = _.pick(project[key], changedKeys)
                  after[key] = _.pick(update[key], changedKeys)
                }
              } else {
                // For other types, do a shallow comparison
                if (project[key] !== update[key]) {
                  before[key] = project[key]
                  after[key] = update[key]
                }
              }
              // Update the project itself
              project[key] = update[key]

              return { before, after }
            },
            {
              before: {} as Partial<BaseProject>,
              after: {} as Partial<BaseProject>,
            }
          )
      : // If no update is defined, the whole project is new, consider the delta as empty
        { before: {}, after: {} }

    if (update && !Object.keys(after).length) {
      // There's supposed to be an update but nothing has been updated
      return null
    }

    // Add a ProjectEvent to project.history
    project.history = [
      ...(project.history || []),
      {
        id: makeId(),
        before,
        after,
        ...context,
        createdAt: Date.now(),
        isNew: true,
      },
    ]

    return project
  }
}

interface MakeProjectDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeProjectDependencies) =>
  buildMakeEntity<Project>(projectSchema, makeId, fields, {
    notifiedOn: 0,
    isInvestissementParticipatif: false,
    isFinancementParticipatif: false,
    engagementFournitureDePuissanceAlaPointe: false,
    garantiesFinancieresSubmittedOn: 0,
    garantiesFinancieresSubmittedBy: '',
    garantiesFinancieresFile: '',
    garantiesFinancieresDate: 0,
  })

export {
  Project,
  ProjectEvent,
  projectSchema,
  territoireSchema,
  buildApplyProjectUpdate,
}
