import { Lauréat } from '@potentiel-domain/projet';

import { gestionnaireRéseauAttribuéV1Projector } from './gestionnaireRéseauAttribuéV1.projector.js';

export const gestionnaireRéseauRaccordementModifiéV1Projector = async ({
  payload: { identifiantGestionnaireRéseau, identifiantProjet },
}: Lauréat.Raccordement.GestionnaireRéseauRaccordementModifiéEventV1) => {
  await gestionnaireRéseauAttribuéV1Projector({
    type: 'GestionnaireRéseauAttribué-V1',
    payload: {
      identifiantGestionnaireRéseau,
      identifiantProjet,
    },
  });
};
