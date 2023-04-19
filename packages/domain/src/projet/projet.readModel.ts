import { ReadModel } from '@potentiel/core-domain';
import { IdentifiantGestionnaireRéseau } from '../gestionnaireRéseau';
import { StatutProjet } from './statutProjet';

export type ProjetReadModel = ReadModel<
  'projet',
  {
    identifiantGestionnaire?: IdentifiantGestionnaireRéseau;
  }
>;

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
