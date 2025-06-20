import { Raccordement } from '@potentiel-domain/projet';

import { gestionnaireRéseauAttribuéV1Projector } from './gestionnaireRéseauAttribuéV1.projector';

export const gestionnaireRéseauRaccordementModifiéV1Projector = async ({
  payload: { identifiantGestionnaireRéseau, identifiantProjet },
}: Raccordement.GestionnaireRéseauRaccordementModifiéEvent) => {
  await gestionnaireRéseauAttribuéV1Projector({
    type: 'GestionnaireRéseauAttribué-V1',
    payload: {
      identifiantGestionnaireRéseau,
      identifiantProjet,
    },
  });
};
