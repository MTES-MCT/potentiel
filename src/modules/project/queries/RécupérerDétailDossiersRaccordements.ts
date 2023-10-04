import { IdentifiantProjet } from '@potentiel/domain';
import { DossierRaccordementReadModel } from '@potentiel/domain-views';

export type RécupérerDétailDossiersRaccordements = (
  identifiantProjet: IdentifiantProjet,
) => Promise<Readonly<Omit<DossierRaccordementReadModel, 'type'>[]> | undefined>;
