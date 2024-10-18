import type { Application, Router } from 'express';

export interface RegisterAuth {
  (args: { app: Application; router: Router }): void;
}
