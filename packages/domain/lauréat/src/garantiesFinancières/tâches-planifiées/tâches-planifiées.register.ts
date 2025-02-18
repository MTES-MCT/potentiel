import { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterTâchesPlanfiéesCommand } from './ajouter/ajouter.command';
import { registerAnnulerTâchesPlanifiéesCommand } from './annuler/annuler.command';

export const registerTâchesPlanifiées = (loadAggregate: LoadAggregate) => {
  // commands
  registerAjouterTâchesPlanfiéesCommand(loadAggregate);
  registerAnnulerTâchesPlanifiéesCommand(loadAggregate);
};
