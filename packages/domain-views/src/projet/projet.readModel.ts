import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type ProjetReadModelKey = `projet#${RawIdentifiantProjet}`;

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
