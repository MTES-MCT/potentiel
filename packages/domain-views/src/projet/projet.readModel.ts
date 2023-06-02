import { ReadModel } from '@potentiel/core-domain';

export type ProjetReadModelKey = `projet#${string}#${string}#${string}#${string}`;

export type ProjetReadModel = ReadModel<
  'projet',
  {
    identifiantGestionnaire?: { codeEIC: string };
  }
>;

type StatutProjet = 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';

export type RésuméProjetReadModel = ReadModel<
  'résumé-projet',
  {
    identifiantProjet: string;
    appelOffre: string;
    période: string;
    famille: string;
    numéroCRE: string;
    statut: StatutProjet;
    nom: string;
    localité: {
      commune: string;
      département: string;
      région: string;
    };
  }
>;
