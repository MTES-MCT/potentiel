import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { MotifDemandeGarantiesFinancières } from '../index.js';
import { Candidature, IdentifiantProjet } from '../../../index.js';

export type GarantiesFinancièresEnregistréesEvent = DomainEvent<
  'GarantiesFinancièresEnregistrées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
  }
>;

export type GarantiesFinancièresImportéesEvent = DomainEvent<
  'GarantiesFinancièresImportées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    importéLe: DateTime.RawType;
  }
>;

export type GarantiesFinancièresModifiéesEvent = DomainEvent<
  'GarantiesFinancièresModifiées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  }
>;

export type HistoriqueGarantiesFinancièresEffacéEvent = DomainEvent<
  'HistoriqueGarantiesFinancièresEffacé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    effacéLe: DateTime.RawType;
    effacéPar: Email.RawType;
  }
>;

export type GarantiesFinancièresDemandéesEvent = DomainEvent<
  'GarantiesFinancièresDemandées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateLimiteSoumission: DateTime.RawType;
    demandéLe: DateTime.RawType;
    motif: MotifDemandeGarantiesFinancières.RawType;
  }
>;

export type TypeGarantiesFinancièresImportéEvent = DomainEvent<
  'TypeGarantiesFinancièresImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    importéLe: DateTime.RawType;
  }
>;

export type GarantiesFinancièresÉchuesEvent = DomainEvent<
  'GarantiesFinancièresÉchues-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateÉchéance: DateTime.RawType;
    échuLe: DateTime.RawType;
  }
>;

export type AttestationGarantiesFinancièresEnregistréeEvent = DomainEvent<
  'AttestationGarantiesFinancièresEnregistrée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
  }
>;

export type GarantiesFinancièresActuellesEvent =
  | GarantiesFinancièresEnregistréesEvent
  | GarantiesFinancièresModifiéesEvent
  | TypeGarantiesFinancièresImportéEvent
  | GarantiesFinancièresDemandéesEvent
  | GarantiesFinancièresÉchuesEvent
  | HistoriqueGarantiesFinancièresEffacéEvent
  | AttestationGarantiesFinancièresEnregistréeEvent
  | GarantiesFinancièresImportéesEvent;
