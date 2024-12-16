import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { Role } from '@potentiel-domain/utilisateur';

type StatistiqueConnexion = {
  type: 'connexionUtilisateur';
  données: {
    utilisateur: {
      role: Role.RawType;
    };
  };
};

export type Statistique = StatistiqueConnexion;

/**
 * @deprecated Cet adapter a pour objectif de permettre l'ajout de statistiques depuis la nouvelle stack,
 * en attendant d'avoir la nouvelle brique de statistique
 */
export const ajouterStatistique = async ({ type, données }: Statistique): Promise<void> => {
  await executeQuery(
    `insert into "statistiquesUtilisation" ("type","date","données") VALUES ($1,NOW(),$2)`,
    type,
    données,
  );
};
