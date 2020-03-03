declare namespace Express {
  export interface Request {
    currentUser: import('../../entities').User
  }
}
