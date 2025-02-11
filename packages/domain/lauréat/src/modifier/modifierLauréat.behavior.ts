import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';

export type ModifierLauréatOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  nomProjet?: string;
  localité?: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    région: string;
    département: string;
  };
};

export type LauréatModifiéEvent = DomainEvent<
  'LauréatModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    nomProjet: string;
    localité: {
      adresse1: string;
      adresse2: string;
      codePostal: string;
      commune: string;
      région: string;
      département: string;
    };
  }
>;

export async function modifier(
  this: LauréatAggregate,
  { identifiantProjet, modifiéLe, modifiéPar, nomProjet, localité }: ModifierLauréatOptions,
) {
  const { adresse1, adresse2, codePostal, commune, département, région } =
    localité ?? this.localité;
  const event: LauréatModifiéEvent = {
    type: 'LauréatModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      modifiéLe: modifiéLe.formatter(),
      modifiéPar: modifiéPar.formatter(),
      nomProjet: nomProjet ?? this.nomProjet,
      localité: {
        adresse1,
        adresse2,
        codePostal,
        commune,
        département,
        région,
      },
    },
  };

  await this.publish(event);
}

export function applyLauréatModifié(
  this: LauréatAggregate,
  { payload: { identifiantProjet, nomProjet, localité } }: LauréatModifiéEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.nomProjet = nomProjet;
  this.localité = localité;
}
