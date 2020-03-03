import * as yup from 'yup'

const projectSchema = yup.object({
  periode: yup
    .string()
    .required()
    .min(2),
  status: yup
    .mixed<'eliminé' | 'lauréat'>()
    .oneOf(['eliminé', 'lauréat'])
    .required(),
  nom: yup
    .string()
    .required()
    .min(3),
  nomCandidat: yup
    .string()
    .required()
    .min(3),
  localisation: yup
    .string()
    .required()
    .min(3),
  puissance: yup
    .number()
    .required()
    .min(1),
  prixUnitaire: yup
    .number()
    .required()
    .min(1)
})

export type Project = yup.InferType<typeof projectSchema>

export default function buildMakeProject() {
  return function makeProject(project: any): Project {
    try {
      projectSchema.validateSync(project)
    } catch (e) {
      throw e
    }

    return project as Project
  }
}
