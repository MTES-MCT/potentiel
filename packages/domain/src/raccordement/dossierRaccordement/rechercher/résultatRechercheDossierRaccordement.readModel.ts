import { ReadModel } from '@potentiel/core-domain';
import { IdentifiantProjet } from '../../../projet/identifiantProjet';

export type RésultatRechercheDossierRaccordementReadModel = ReadModel<
  'résultat-recherche-dossier-raccordement',
  {
    identifiantProjet: IdentifiantProjet;
  }
>;
