import * as yup from 'yup'

const projectAdmissionKeySchema = yup.object({
  id: yup.string().required(),
  projectId: yup.string().required(),
  email: yup.string().required()
})

export type ProjectAdmissionKey = yup.InferType<
  typeof projectAdmissionKeySchema
>

export default function buildMakeProjectAdmissionKey() {
  return function makeProjectAdmissionKey(
    projectAdmissionKey: any
  ): ProjectAdmissionKey {
    try {
      return projectAdmissionKeySchema.validateSync(projectAdmissionKey, {
        stripUnknown: true
      })
    } catch (e) {
      throw e
    }
  }
}
