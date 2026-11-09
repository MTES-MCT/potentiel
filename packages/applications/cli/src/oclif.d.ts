import '@oclif/core';

declare module '@oclif/core' {
  interface Command {
    /** @deprecated OCLIF logger, use Potentiel getLogger instead */
    log(message?: string, ...args: any[]): void;
  }
}
