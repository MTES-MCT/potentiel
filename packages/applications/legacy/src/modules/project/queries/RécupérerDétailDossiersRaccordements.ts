import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

export type RécupérerDétailDossiersRaccordements = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers']>;
