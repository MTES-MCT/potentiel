import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { StatistiqueUtilisation } from '../statistiqueUtilisation.type.js';
import type { AjouterStatistiqueUtilisationPort } from './ajouterStatistiqueUtilisation.port.js';

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
