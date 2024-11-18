import type { Application } from 'express';

export interface RegisterAuth {
  (args: { app: Application }): void;
}
