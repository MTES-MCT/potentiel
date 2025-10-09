import { Args, Command } from '@oclif/core';

import { registerProjetUseCases } from '@potentiel-domain/projet';
import { getProjetAggregateRootAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getDossier } from '@potentiel-infrastructure/ds-api-client';

export class ImporterDossierCandidatureCommand extends Command {
  static args = {
    numéroDossier: Args.integer({ required: true }),
  };
  async init() {
    registerProjetUseCases({
      getProjetAggregateRoot: getProjetAggregateRootAdapter,
      supprimerDocumentProjetSensible: () => {
        throw new Error('not implemented');
      },
    });
  }

  async run() {
    const { args } = await this.parse(ImporterDossierCandidatureCommand);
    try {
      const dépôt = await getDossier(args.numéroDossier);
      console.log(JSON.stringify(dépôt, null, 2));
    } catch (e) {
      console.log(e);
    }
  }
}
