import { Raccordement } from '@potentiel-domain/laureat';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { gestionnaireRéseauAttribuéV1Projector } from './gestionnaireRéseauAttribuéV1.projector';

export const gestionnaireRéseauInconnuAttribuéV1Projector = async ({
  payload: { identifiantProjet },
}: Raccordement.GestionnaireRéseauInconnuAttribuéEvent) => {
  await gestionnaireRéseauAttribuéV1Projector({
    type: 'GestionnaireRéseauAttribué-V1',
    payload: {
      identifiantGestionnaireRéseau:
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.codeEIC,
      identifiantProjet,
    },
  });
};
