import { Args, Command } from '@oclif/core';

import { ProjetAggregateRoot, registerProjetUseCases } from '@potentiel-domain/projet';
import { AppelOffreAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getDossier } from '@potentiel-infrastructure/ds-api-client';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';

export class ImporterDossierCandidatureCommand extends Command {
  static args = {
    numéroDossier: Args.integer({ required: true }),
  };
  async init() {
    registerProjetUseCases({
      getProjetAggregateRoot: (identifiant) =>
        ProjetAggregateRoot.get(identifiant, {
          loadAggregate: loadAggregateV2,
          loadAppelOffreAggregate: AppelOffreAdapter.loadAppelOffreAggregateAdapter,
        }),
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
