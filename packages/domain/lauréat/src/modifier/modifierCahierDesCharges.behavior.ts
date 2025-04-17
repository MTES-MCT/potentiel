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
    cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.RawType;
  }
>;

export type ModifierCahierDesChargesOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.ValueType;
};

export async function modifierCahierDesCharges(
  this: LauréatAggregate,
  { identifiantProjet, modifiéLe, modifiéPar, cahierDesCharges }: ModifierCahierDesChargesOptions,
) {
  if (this.cahierDesCharges.estÉgaleÀ(cahierDesCharges)) {
    throw new CahierDesChargesNonModifiéError();
  }

  //  TODO Pending aggregateRoot
  // if (
  //   cahierDesCharges.type === 'modifié' &&
  //   this.période.cahiersDesChargesModifiésDisponibles.find((cdc) =>
  //     AppelOffre.RéférenceCahierDesCharges.bind(cdc).estÉgaleÀ(cahierDesCharges),
  //   )
  // ) {
  //   throw new CahierDesChargesIndisponibleError();
  // }

  // if (cahierDesCharges.type === 'initial' && !this.appelOffres.doitPouvoirChoisirCDCInitial) {
  //   throw new RetourAuCahierDesChargesInitialImpossibleError();
  // }

  const event: CahierDesChargesModifiéEvent = {
    type: 'CahierDesChargesModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      modifiéLe: modifiéLe.formatter(),
      modifiéPar: modifiéPar.formatter(),
      cahierDesCharges: cahierDesCharges.formatter(),
    },
  };

  await this.publish(event);
}

export function applyCahierDesChargesModifié(
  this: LauréatAggregate,
  { payload: { cahierDesCharges } }: CahierDesChargesModifiéEvent,
) {
  this.cahierDesCharges =
    AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(cahierDesCharges);
}

class CahierDesChargesNonModifiéError extends InvalidOperationError {
  constructor() {
    super("Ce cahier des charges est identique à l'actuel");
  }
}

// class CahierDesChargesIndisponibleError extends InvalidOperationError {
//   constructor() {
//     super("Ce cahier des charges n'est pas disponible pour cette période");
//   }
// }

// class RetourAuCahierDesChargesInitialImpossibleError extends InvalidOperationError {
//   constructor() {
//     super('Il est impossible de revenir au cahier de charges en vigueur à la candidature');
//   }
// }
