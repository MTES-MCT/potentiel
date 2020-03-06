import * as yup from 'yup'

const userSchema = yup.object({
  id: yup.string(),
  firstName: yup
    .string()
    .required()
    .min(1),
  lastName: yup
    .string()
    .required()
    .min(1),
  role: yup
    .mixed<'admin' | 'dgec' | 'porteur-projet'>()
    .oneOf(['admin', 'dgec', 'porteur-projet'])
})

export type User = yup.InferType<typeof userSchema>

export default function buildMakeUser() {
  return function makeUser(user: any): User {
    try {
      return userSchema.validateSync(user, { stripUnknown: true })
    } catch (e) {
      throw e
    }
  }
}
