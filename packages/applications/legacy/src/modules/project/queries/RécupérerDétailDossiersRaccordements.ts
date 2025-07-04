import { IdentifiantProjet } from '@potentiel-domain/common';

export type RécupérerDétailDossiersRaccordements = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers']>;
