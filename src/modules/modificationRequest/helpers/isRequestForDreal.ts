import { ModificationRequestVariants } from '../dtos'
import { AuthorizedTypesForDreal } from './AuthorizedTypesForDreal'

export const isRequestForDreal = (type: ModificationRequestVariants['type']) => {
  return AuthorizedTypesForDreal.includes(type)
}
