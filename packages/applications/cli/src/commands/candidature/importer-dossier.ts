import { Args, Command } from '@oclif/core';

import { registerProjetUseCases } from '@potentiel-domain/projet';
import { getDépôtCandidature } from '@potentiel-infrastructure/ds-api-client';
import { getProjetAggregateRootAdapter } from '@potentiel-applications/bootstrap';

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
      const dépôt = await getDépôtCandidature(args.numéroDossier);
      console.log(JSON.stringify(dépôt, null, 2));
    } catch (e) {
      console.log(e);
    }
  }
}
