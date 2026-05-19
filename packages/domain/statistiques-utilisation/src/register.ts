import {
  type RegisterAjouterStatistiqueUtilisationCommandDependencies,
  registerAjouterStatistiqueUtilisationCommand,
} from './ajouter/ajouterStatistiqueUtilisation.command.js';

type RegisterNotificationDependencies = RegisterAjouterStatistiqueUtilisationCommandDependencies;

export const registerStatistiquesUtilisationCommands = (deps: RegisterNotificationDependencies) => {
  registerAjouterStatistiqueUtilisationCommand(deps);
};
