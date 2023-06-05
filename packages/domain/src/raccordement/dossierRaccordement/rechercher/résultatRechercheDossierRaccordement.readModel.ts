import { ReadModel } from '@potentiel/core-domain';
import { IdentifiantProjet } from '../../../projet/projet.valueType';

export type RésultatRechercheDossierRaccordementReadModel = ReadModel<
  'résultat-recherche-dossier-raccordement',
  {
    identifiantProjet: IdentifiantProjet;
  }
>;
