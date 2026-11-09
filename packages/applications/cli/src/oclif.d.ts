import '@oclif/core';
import type { Logger } from '@oclif/core/interfaces';

declare module '@oclif/core' {
  /** @deprecated Use Potentiel getLogger instead */
  function getLogger(): Logger;

  interface Command {
    /** @deprecated OCLIF logger, use Potentiel getLogger instead */
    log(message?: string, ...args: any[]): void;
  }
}
