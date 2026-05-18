import type { AjouterStatistiqueUtilisationPort } from '@potentiel-domain/statistiques-utilisation';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

/**
 * Ajout de statistiques via une commande qui appel cet adapter (injection de la dépendance via bootstrap)
 * Il pourrait être intéressant de faire une refacto à l'avenir si c'est pertinent, en envisageant un flow permettant l'ajout de projection ?
 */
export const ajouterStatistique: AjouterStatistiqueUtilisationPort = async ({ type, données }) => {
  await executeQuery(
    `insert into "statistiquesUtilisation" ("type","date","données") VALUES ($1,NOW(),$2)`,
    type,
    données,
  );
};
