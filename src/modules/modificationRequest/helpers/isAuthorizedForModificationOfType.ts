import { User } from '../../../entities'
import { ModificationRequestVariants } from '../dtos'
import { AuthorizedTypesForDreal } from './AuthorizedTypesForDreal'

export const isAuthorizedForRequestType = (args: {
  role: User['role']
  type: ModificationRequestVariants['type']
}) => {
  const { role, type } = args
  return (
    (role === 'dreal' && AuthorizedTypesForDreal.includes(type)) ||
    role === 'dgec' ||
    role === 'admin'
  )
}
