import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { Candidature, IdentifiantProjet } from '../..';

export type DépôtGarantiesFinancièresEnCoursValidéEventV1 = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursValidé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    validéLe: DateTime.RawType;
    validéPar: Email.RawType;
  }
>;

export type DépôtGarantiesFinancièresEnCoursValidéEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursValidé-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    dateConstitution: DateTime.RawType;
    soumisLe: DateTime.RawType;
    attestation?: { format: string };

    validéLe: DateTime.RawType;
    validéPar: Email.RawType;
  }
>;

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

export type GarantiesFinancièresEvent =
  | DépôtGarantiesFinancièresEnCoursValidéEventV1
  | DépôtGarantiesFinancièresEnCoursValidéEvent
  | GarantiesFinancièresEnregistréesEvent
  | GarantiesFinancièresModifiéesEvent
  | HistoriqueGarantiesFinancièresEffacéEvent;
