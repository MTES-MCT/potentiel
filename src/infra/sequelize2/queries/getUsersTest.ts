import { User } from '../projections'

export const getUsersTest = () => {
  return User.findAll({})
}
