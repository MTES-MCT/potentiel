import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Lauréat } from '@potentiel-domain/projet';

import { gestionnaireRéseauAttribuéV1Projector } from './gestionnaireRéseauAttribuéV1.projector.js';

export const gestionnaireRéseauInconnuAttribuéV1Projector = async ({
  payload: { identifiantProjet },
}: Lauréat.Raccordement.GestionnaireRéseauInconnuAttribuéEvent) => {
  await gestionnaireRéseauAttribuéV1Projector({
    type: 'GestionnaireRéseauAttribué-V1',
    payload: {
      identifiantGestionnaireRéseau:
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.codeEIC,
      identifiantProjet,
    },
  });
};
