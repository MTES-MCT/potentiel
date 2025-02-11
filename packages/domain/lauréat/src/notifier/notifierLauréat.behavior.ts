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
    département: string;
    région: string;
  };
};

/**
 * @deprecated Remplacé par LauréatNotifié-V2 qui ajoute le nom et la localité du projet
 * L'évènement NomEtLocalitéLauréatImportés-V1 permet d'ajouter les valeurs manquantes pour les projets notifiés avec la V1
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

/**
 * @deprecated Ajoute les informations nomProjet et localité à un lauréat notifié avec LauréatNotifié-V1
 * Tous les évènements LauréatNotifié-V1 doivent avoir un évènement NomEtLocalitéLauréatImportés-V1 associé
 */
export type NomEtLocalitéLauréatImportésEvent = DomainEvent<
  'NomEtLocalitéLauréatImportés-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
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

export function applyLauréatNotifiéV1(
  this: LauréatAggregate,
  { payload: { identifiantProjet, notifiéLe } }: LauréatNotifiéV1Event,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.notifiéLe = DateTime.convertirEnValueType(notifiéLe);
}

export function applyNomEtlocalitéLauréatImportés(
  this: LauréatAggregate,
  { payload: { localité, nomProjet } }: NomEtLocalitéLauréatImportésEvent,
) {
  this.nomProjet = nomProjet;
  this.localité = localité;
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
