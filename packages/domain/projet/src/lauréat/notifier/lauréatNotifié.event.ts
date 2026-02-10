import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';

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
