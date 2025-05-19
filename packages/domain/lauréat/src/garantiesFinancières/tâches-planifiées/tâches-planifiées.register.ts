import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerAjouterTâchesPlanfiéesCommand } from './ajouter/ajouter.command';
import { registerAnnulerTâchesPlanifiéesCommand } from './annuler/annuler.command';

export const registerTâchesPlanifiées = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerAjouterTâchesPlanfiéesCommand(loadAggregate, getProjetAggregateRoot);
  registerAnnulerTâchesPlanifiéesCommand(loadAggregate);
};
