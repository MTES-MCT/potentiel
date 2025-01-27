import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  attestation: {
    format: string;
  };
  nomProjet: string;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    région: string;
    département: string;
  };
};

/**
 * l'évènement V1 ne contenait pas les informations nomProjet et localité;
 * Une V2 est émise pour chaque V1, donc V1 n'est plus à utiliser
 */
export type LauréatNotifiéV1Event = DomainEvent<
  'LauréatNotifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;

    attestation: {
      format: string;
    };
  }
>;

export type LauréatNotifiéEvent = DomainEvent<
  'LauréatNotifié-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;

    attestation: {
      format: string;
    };

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

export async function notifier(
  this: LauréatAggregate,
  {
    identifiantProjet,
    notifiéLe,
    notifiéPar,
    attestation: { format },
    nomProjet,
    localité: { adresse1, adresse2, codePostal, commune, département, région },
  }: NotifierOptions,
) {
  const event: LauréatNotifiéEvent = {
    type: 'LauréatNotifié-V2',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      notifiéLe: notifiéLe.formatter(),
      notifiéPar: notifiéPar.formatter(),
      attestation: {
        format,
      },
      nomProjet,
      localité: {
        adresse1,
        adresse2,
        codePostal,
        commune,
        région,
        département,
      },
    },
  };

  await this.publish(event);
}

export function applyLauréatNotifié(
  this: LauréatAggregate,
  { payload: { identifiantProjet, notifiéLe, localité, nomProjet } }: LauréatNotifiéEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.notifiéLe = DateTime.convertirEnValueType(notifiéLe);
  this.nomProjet = nomProjet;
  this.localité = localité;
}
