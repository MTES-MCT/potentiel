import * as yup from 'yup'

const isUuid = yup.string().required().uuid()

export const validateUniqueId = (uniqueId: string): boolean => {
  return isUuid.isValidSync(uniqueId)
}
