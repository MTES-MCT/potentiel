import { Raccordement } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getRaccordement } from './getRaccordement';

export const getDossierRaccordement = async (
  identifiantProjet: IdentifiantProjet.RawType,
  référenceDossierRaccordement: Raccordement.RéférenceDossierRaccordement.RawType,
) => {
  const raccordement = await getRaccordement(identifiantProjet);
  const dossier = raccordement.dossiers.find((d) => d.référence === référenceDossierRaccordement);

  if (!dossier) {
    throw new Error('Dossier Raccordement non trouvé');
  }
  return { raccordement, dossier };
};
