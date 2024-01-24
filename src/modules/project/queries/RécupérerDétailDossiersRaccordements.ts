import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';

export type RécupérerDétailDossiersRaccordements = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Raccordement.ListerDossierRaccordementReadModel['dossiers']>;
