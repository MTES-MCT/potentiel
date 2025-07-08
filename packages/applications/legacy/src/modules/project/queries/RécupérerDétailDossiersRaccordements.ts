import { IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

export type RécupérerDétailDossiersRaccordements = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers']>;
