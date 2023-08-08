import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type ProjetReadModelKey = `projet|${RawIdentifiantProjet}`;

type StatutProjet = 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';

export type ProjetReadModel = ReadModel<
  'projet',
  {
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
    identifiantGestionnaire?: { codeEIC: string };
  }
>;
