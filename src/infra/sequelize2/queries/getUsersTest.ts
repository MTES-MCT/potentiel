import { usersProjection } from '../projections'

export const getUsersTest = () => {
  return usersProjection.model.findAll({})
}
