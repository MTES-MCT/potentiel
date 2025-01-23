import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/laureat';

export type RécupérerDétailDossiersRaccordements = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Raccordement.ConsulterRaccordementReadModel['dossiers']>;
