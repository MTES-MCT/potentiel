import { LoadAggregate } from '@potentiel-domain/core';
import { registerAjouterTâcheCommand } from './ajouter/ajouterTâche.command';
import { registerAcheverTâcheCommand } from './achever/acheverTâche.command';

export type TâcheCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerTâcheCommand = ({ loadAggregate }: TâcheCommandDependencies) => {
  registerAjouterTâcheCommand(loadAggregate);
  registerAcheverTâcheCommand(loadAggregate);
};
