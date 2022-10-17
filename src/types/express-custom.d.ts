import { User } from '@entities'
import { Feedback } from '../../controllers'

declare module 'express-serve-static-core' {
  // eslint-disable-next-line
  interface Request {
    user: User & { accountUrl: string }
    kauth: any
  }
}

declare module 'express-session' {
  interface SessionData {
    forms?: Record<
      string,
      | {
          feedback: Feedback
        }
      | undefined
    >
  }
}
