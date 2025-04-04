import { InvalidOperationError, DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { LauréatAggregate } from '../lauréat.aggregate';

export type CahierDesChargesModifiéEvent = DomainEvent<
  'CahierDesChargesModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    cahierDesCharges: AppelOffre.CahierDesChargesRéférence;
  }
>;

export type ModifierCahierDesChargesOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  cahierDesCharges: AppelOffre.CahierDesChargesRéférence;
};

export async function modifierCahierDesCharges(
  this: LauréatAggregate,
  { identifiantProjet, modifiéLe, modifiéPar, cahierDesCharges }: ModifierCahierDesChargesOptions,
) {
  if (this.cahierDesCharges === cahierDesCharges) {
    throw new CahierDesChargesNonModifié();
  }

  const event: CahierDesChargesModifiéEvent = {
    type: 'CahierDesChargesModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      modifiéLe: modifiéLe.formatter(),
      modifiéPar: modifiéPar.formatter(),
      cahierDesCharges,
    },
  };

  await this.publish(event);
}

export function applyCahierDesChargesModifié(
  this: LauréatAggregate,
  { payload: { cahierDesCharges } }: CahierDesChargesModifiéEvent,
) {
  this.cahierDesCharges = cahierDesCharges;
}

class CahierDesChargesNonModifié extends InvalidOperationError {
  constructor() {
    super("Ce cahier des charges est identique à l'actuel");
  }
}
