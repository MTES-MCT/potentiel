import { mediator, Message, MessageHandler } from 'mediateur';

import { StatistiquesAdapter } from '@potentiel-infrastructure/domain-adapters';

export type AjouterStatistique = Message<
  'System.Statistiques.AjouterStatistique',
  StatistiquesAdapter.Statistique
>;

export const setupStatistiques = () => {
  const handler: MessageHandler<AjouterStatistique> = async ({ type, données }) => {
    await StatistiquesAdapter.ajouterStatistique({ type, données });
  };
  mediator.register('System.Statistiques.AjouterStatistique', handler);
};
