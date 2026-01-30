import {
  AjouterStatistiqueUtilisationPort,
  registerStatistiquesUtilisationCommands,
} from '@potentiel-domain/statistiques-utilisation';

export type SetupStatistiqueUtilisationDependencies = {
  ajouterStatistiqueUtilisation: AjouterStatistiqueUtilisationPort;
};

export const setupStatistiqueUtilisation = (deps: SetupStatistiqueUtilisationDependencies) =>
  registerStatistiquesUtilisationCommands(deps);
