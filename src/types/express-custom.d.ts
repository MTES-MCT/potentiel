import { User } from '@entities'

declare module 'express-serve-static-core' {
  // eslint-disable-next-line
  interface Request {
    user: User & { accountUrl: string }
    kauth: any
  }
}
