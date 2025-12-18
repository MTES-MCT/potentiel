import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

import { TypeReprésentantLégal } from '.';

export type ReprésentantLégalEvent =
  | ReprésentantLégalImportéEvent
  | ReprésentantLégalModifiéEvent
  | ChangementReprésentantLégalAccordéEvent
  | ChangementReprésentantLégalAnnuléEvent
  | ChangementReprésentantLégalDemandéEvent
  | ChangementReprésentantLégalRejetéEvent
  | ChangementReprésentantLégalSuppriméEvent
  | ChangementReprésentantLégalCorrigéEvent
  | ChangementReprésentantLégalEnregistréEvent;

export type ReprésentantLégalImportéEvent = DomainEvent<
  'ReprésentantLégalImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

export type ReprésentantLégalModifiéEvent = DomainEvent<
  'ReprésentantLégalModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison?: string;
    piècesJustificatives?: {
      format: string;
    };
  }
>;

export type ChangementReprésentantLégalAccordéEvent = DomainEvent<
  'ChangementReprésentantLégalAccordé-V1',
  {
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    accordAutomatique: boolean;
    avecCorrection?: true;
  }
>;

export type ChangementReprésentantLégalAnnuléEvent = DomainEvent<
  'ChangementReprésentantLégalAnnulé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
  }
>;

export type ChangementReprésentantLégalCorrigéEvent = DomainEvent<
  'ChangementReprésentantLégalCorrigé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    corrigéLe: DateTime.RawType;
    corrigéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type ChangementReprésentantLégalDemandéEvent = DomainEvent<
  'ChangementReprésentantLégalDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type ChangementReprésentantLégalRejetéEvent = DomainEvent<
  'ChangementReprésentantLégalRejeté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    motifRejet: string;
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    rejetAutomatique: boolean;
  }
>;

export type ChangementReprésentantLégalSuppriméEvent = DomainEvent<
  'ChangementReprésentantLégalSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: Email.RawType;
  }
>;

export type ChangementReprésentantLégalEnregistréEvent = DomainEvent<
  'ChangementReprésentantLégalEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;
