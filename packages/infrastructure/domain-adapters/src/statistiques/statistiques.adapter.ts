import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { AjouterStatistiqueUtilisationPort } from '@potentiel-statistiques/statistiques-utilisation';
/**
 * @deprecated Cet adapter a pour objectif de permettre l'ajout de statistiques depuis la nouvelle stack,
 * en attendant d'avoir la nouvelle brique de statistique
 */
export const ajouterStatistique: AjouterStatistiqueUtilisationPort = async ({ type, données }) => {
  await executeQuery(
    `insert into "statistiquesUtilisation" ("type","date","données") VALUES ($1,NOW(),$2)`,
    type,
    données,
  );
};
