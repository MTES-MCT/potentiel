import { LoadAggregate } from '@potentiel-domain/core';
import { registerAjouterTâcheCommand } from './ajouter/ajouterTâche.command';
import { registerSupprimerTâcheCommand } from './supprimer/supprimerTâche.command';

export type TâcheCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerTâcheCommand = ({ loadAggregate }: TâcheCommandDependencies) => {
  registerAjouterTâcheCommand(loadAggregate);
  registerSupprimerTâcheCommand(loadAggregate);
};
