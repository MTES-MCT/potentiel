import { IdentifiantProjet } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Raccordement } from '@potentiel-domain/projet';

import { RaccordementAggregate } from '../raccordement.aggregate';

type SupprimerRaccordementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function supprimerRaccordement(
  this: RaccordementAggregate,
  { identifiantProjet }: SupprimerRaccordementOptions,
) {
  const raccordementSupprimé: Raccordement.RaccordementSuppriméEvent = {
    type: 'RaccordementSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
    },
  };

  await this.publish(raccordementSupprimé);
}

export function applyRaccordementSuppriméEventV1(
  this: RaccordementAggregate,
  event: Raccordement.RaccordementSuppriméEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  this.identifiantGestionnaireRéseau = GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu;
  this.dossiers = new Map();
}
