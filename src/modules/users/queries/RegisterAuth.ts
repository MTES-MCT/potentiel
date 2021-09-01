import type { Application, Router } from 'express'

export interface RegisterAuth {
  (args: { app: Application; sessionSecret: string; router: Router }): void
}
