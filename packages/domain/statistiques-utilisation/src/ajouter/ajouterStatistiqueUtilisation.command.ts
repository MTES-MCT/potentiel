import { Message, MessageHandler, mediator } from 'mediateur';

import { StatistiqueUtilisation } from '../statistiqueUtilisation.type.js';

import { AjouterStatistiqueUtilisationPort } from './ajouterStatistiqueUtilisation.port.js';

export type AjouterStatistiqueUtilisationCommand = Message<
  'System.Statistiques.AjouterStatistiqueUtilisation',
  StatistiqueUtilisation
>;

export type RegisterAjouterStatistiqueUtilisationCommandDependencies = {
  ajouterStatistiqueUtilisation: AjouterStatistiqueUtilisationPort;
};

export const registerAjouterStatistiqueUtilisationCommand = ({
  ajouterStatistiqueUtilisation,
}: RegisterAjouterStatistiqueUtilisationCommandDependencies) => {
  const handler: MessageHandler<AjouterStatistiqueUtilisationCommand> = async (statistique) => {
    await ajouterStatistiqueUtilisation(statistique);
  };
  mediator.register('System.Statistiques.AjouterStatistiqueUtilisation', handler);
};
