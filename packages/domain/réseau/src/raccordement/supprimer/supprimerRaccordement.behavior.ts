import { IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { RaccordementAggregate } from '../raccordement.aggregate';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type RaccordementSuppriméEvent = DomainEvent<
  'RaccordementSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

type SupprimerRaccordementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function supprimerRaccordement(
  this: RaccordementAggregate,
  { identifiantProjet }: SupprimerRaccordementOptions,
) {
  const raccordementSupprimé: RaccordementSuppriméEvent = {
    type: 'RaccordementSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
    },
  };

  await this.publish(raccordementSupprimé);
}

export function applyRaccordementSuppriméEventV1(
  this: RaccordementAggregate,
  event: RaccordementSuppriméEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.inconnu;
  this.dossiers = new Map();
}
