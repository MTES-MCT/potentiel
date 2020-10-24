import { User } from '../../entities'

// eslint-disable-next-line no-unused-vars
declare namespace Express {
  export interface Request {
    currentUser: User
  }
}
