import {
  AjouterStatistiqueUtilisationPort,
  registerStatistiquesUtilisationCommands,
} from '@potentiel-statistiques/statistiques-utilisation';

export type SetupStatistiqueUtilisationDependencies = {
  ajouterStatistiqueUtilisation: AjouterStatistiqueUtilisationPort;
};

export const setupStatistiqueUtilisation = (deps: SetupStatistiqueUtilisationDependencies) =>
  registerStatistiquesUtilisationCommands(deps);
