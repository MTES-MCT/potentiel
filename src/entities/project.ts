import * as yup from 'yup'
import { CandidateNotification } from './candidateNotification'

const projectSchema = yup.object({
  id: yup.string(),
  periode: yup.string().required(),
  numeroCRE: yup
    .string()
    .required()
    .min(1),
  famille: yup.string().required(),
  nomCandidat: yup
    .string()
    .required()
    .min(2),
  nomProjet: yup
    .string()
    .required()
    .min(2),
  puissance: yup
    .number()
    .required()
    .min(1),
  prixReference: yup
    .number()
    .required()
    .min(1),
  evaluationCarbone: yup
    .number()
    .required()
    .min(1),
  note: yup.number().required(),
  nomRepresentantLegal: yup
    .string()
    .required()
    .min(2),
  email: yup.string().required(),
  adresseProjet: yup
    .string()
    .required()
    .min(2),
  codePostalProjet: yup
    .string()
    .required()
    .min(2),
  communeProjet: yup
    .string()
    .required()
    .min(2),
  departementProjet: yup
    .string()
    .required()
    .min(2),
  regionProjet: yup
    .string()
    .required()
    .min(2),
  fournisseur: yup.string().min(2),
  actionnaire: yup.string().min(2),
  producteur: yup.string().min(2),
  classe: yup.mixed<'Eliminé' | 'Classé'>().oneOf(['Eliminé', 'Classé']),
  motifsElimination: yup.string(),
  hasBeenNotified: yup.boolean().default(false),
  candidateNotifications: yup.array<CandidateNotification>()
})

export type Project = yup.InferType<typeof projectSchema>

export default function buildMakeProject() {
  return function makeProject(project: any): Project {
    // console.log('makeProject received', project)
    try {
      return projectSchema.validateSync(project, { stripUnknown: true })
    } catch (e) {
      throw e
    }
  }
}
