import { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterTâchesCommand } from './ajouter/ajouterTâches.command';
import { registerAnnulerTâchesCommand } from './annuler/annulerTâches.command';

export const registerTâchesPlanifiées = (loadAggregate: LoadAggregate) => {
  // commands
  registerAjouterTâchesCommand(loadAggregate);
  registerAnnulerTâchesCommand(loadAggregate);
};
