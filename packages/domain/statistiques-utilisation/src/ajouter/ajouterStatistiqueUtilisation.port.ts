import { StatistiqueUtilisation } from '../statistiqueUtilisation.type.js';

export type AjouterStatistiqueUtilisationPort = (
  statistique: StatistiqueUtilisation,
) => Promise<void>;
