import isEmail from 'isemail'
import pick from 'lodash/pick'
import buildMakeEntity from '../helpers/buildMakeEntity'
import {
  Boolean,
  Literal,
  Number,
  Partial as SchemaPartial,
  Record as SchemaRecord,
  Static,
  String,
  Undefined,
  Union,
  Unknown,
} from '../types/schemaTypes'
import { ModificationRequest } from './modificationRequest'
import { User } from './user'
import { ProjectAppelOffre, Technologie, technologies } from './appelOffre'
import { Famille } from './famille'
import { CertificateTemplate, isNotifiedPeriode } from './periode'

import { territoireSchema } from './territoire'
import { logger } from '@core/utils'

const baseProjectSchema = SchemaRecord({
  id: String,
  appelOffreId: String,
  periodeId: String,
  numeroCRE: String,
  familleId: String,
  nomCandidat: String,
  nomProjet: String,
  puissance: Number.withConstraint((value) => value > 0),
  puissanceInitiale: Number.withConstraint((value) => value > 0),
  prixReference: Number.withConstraint((value) => value >= 0),
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
  certificateFileId: String,
  garantiesFinancieresDueOn: Number,
  garantiesFinancieresRelanceOn: Number,
  garantiesFinancieresSubmittedOn: Number,
  garantiesFinancieresSubmittedBy: String,
  garantiesFinancieresFile: String,
  garantiesFinancieresFileId: String,
  garantiesFinancieresDate: Number,
  dcrDueOn: Number,
  dcrSubmittedOn: Number,
  dcrSubmittedBy: String,
  dcrNumeroDossier: String,
  dcrFile: String,
  dcrFileId: String,
  dcrDate: Number,
  completionDueOn: Number,
  abandonedOn: Number,
  numeroGestionnaire: String,
  cahierDesChargesActuel: Union(
    Literal('initial'),
    Literal('30/07/2021'),
    Literal('30/08/2022'),
    Literal('30/08/2022-alternatif')
  ),
  potentielIdentifier: String,
  technologie: String.withGuard((value: string): value is Technologie =>
    technologies.includes(value as Technologie)
  ),
})
const projectSchema = baseProjectSchema.And(
  SchemaPartial({
    actionnaire: String,
    territoireProjet: territoireSchema.Or(Undefined),
    appelOffre: Unknown.withGuard((obj: any): obj is ProjectAppelOffre => true), // This would be type ProjectAppelOffre
    famille: Unknown.withGuard((obj: any): obj is Famille => true),
    createdAt: Unknown.withGuard((obj: any): obj is Date => true),
    updatedAt: Unknown.withGuard((obj: any): obj is Date => true),
  })
)

const fields: string[] = [
  'actionnaire',
  'territoireProjet',
  'appelOffre',
  'history',
  'details',
  'garantiesFinancieresFileRef',
  'dcrFileRef',
  'certificateFile',
  'famille',
  'createdAt',
  'updatedAt',
  'gf',
  'cahierDesChargesActuel',
  'potentielIdentifier',
  ...Object.keys(baseProjectSchema.fields),
]

type BaseProject = Static<typeof projectSchema> & {
  details?: Record<string, any>
  garantiesFinancieresFileRef?: {
    id: string
    filename: string
  }
  dcrFileRef?: {
    id: string
    filename: string
  }
  certificateFile?: {
    id: string
    filename: string
  }
  gf?: {
    id: string
    status: 'à traiter' | 'validé'
    statusUpdatedOn: Date
    user: { fullName: string }
  }
  cahierDesChargesActuel: 'initial' | '30/07/2021' | '30/08/2022' | '30/08/2022-alternatif'
  readonly potentielIdentifier: string
  actionnariat?: '' | 'financement-collectif' | 'gouvernance-partagee'
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
    | 'certificate-generation'
    | 'garanties-financieres-submission'
    | 'garanties-financieres-file-move'
    | 'garanties-financieres-removal'
    | 'relance-gf'
    | 'manual-edition'
    | 'dcr-submission'
    | 'dcr-removal'
    | 'dcr-file-move'
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
  return ({ project, update, context }: ApplyProjectUpdateProps): Project | null => {
    // Determine before/after values from the project and update
    const { before, after } = update
      ? Object.keys(update)
          .filter(
            (key) =>
              key !== 'id' &&
              // Only accept changes to notifiedOn for candidate-notifications
              (context.type === 'candidate-notification' || key !== 'notifiedOn')
          )
          .reduce(
            ({ before, after }, key: string) => {
              if (project[key] && typeof project[key] === 'object') {
                // For objects, do a deep compare
                const changedKeys = [
                  ...Object.keys(project[key]),
                  ...Object.keys(update[key]),
                ].filter((innerKey) => project[key][innerKey] !== update[key][innerKey])

                if (changedKeys.length) {
                  before[key] = pick(project[key], changedKeys)
                  after[key] = pick(update[key], changedKeys)
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

const getCertificateIfProjectEligible = (
  project: Project,
  ignoreNotifiedOn?: boolean
): CertificateTemplate | null => {
  if (!ignoreNotifiedOn && !project.notifiedOn) {
    logger.error('getCertificateIfProjectEligible failed on project notifiedOn')
    return null
  }

  if (project.appelOffre?.periode && !isNotifiedPeriode(project.appelOffre?.periode)) {
    logger.error(new Error('getCertificateIfProjectEligible failed on isNotifiedPeriode(periode)'))
    return null
  }

  if (!project.appelOffre?.periode?.certificateTemplate) {
    logger.error('getCertificateIfProjectEligible failed on periode.certificateTemplate')
    return null
  }

  return project.appelOffre?.periode?.certificateTemplate
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
    certificateFileId: '',
    garantiesFinancieresDueOn: 0,
    garantiesFinancieresRelanceOn: 0,
    garantiesFinancieresSubmittedOn: 0,
    garantiesFinancieresSubmittedBy: '',
    garantiesFinancieresFile: '',
    garantiesFinancieresFileId: '',
    garantiesFinancieresDate: 0,
    dcrDueOn: 0,
    dcrSubmittedOn: 0,
    dcrSubmittedBy: '',
    dcrFile: '',
    dcrFileId: '',
    dcrNumeroDossier: '',
    dcrDate: 0,
    completionDueOn: 0,
    abandonedOn: 0,
    numeroGestionnaire: '',
    cahierDesChargesActuel: 'initial',
    potentielIdentifier: '',
    technologie: 'N/A',
  })

export {
  Project,
  ProjectEvent,
  projectSchema,
  territoireSchema,
  buildApplyProjectUpdate,
  getCertificateIfProjectEligible,
}
