import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { Candidature, IdentifiantProjet } from '../../..';

/**
 * @deprecated Utilisez DépôtGarantiesFinancièresEnCoursValidéEvent à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
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
    dateDélibération?: DateTime.RawType;
    dateConstitution: DateTime.RawType;
    soumisLe: DateTime.RawType;
    attestation?: { format: string };

    validéLe: DateTime.RawType;
    validéPar: Email.RawType;
  }
>;

export type DépôtGarantiesFinancièresEnCoursModifiéEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    dateDélibération?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  }
>;

export type DépôtGarantiesFinancièresSoumisEvent = DomainEvent<
  'DépôtGarantiesFinancièresSoumis-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    dateDélibération?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    soumisLe: DateTime.RawType;
    soumisPar: Email.RawType;
  }
>;

/** @deprecated utiliser DépôtGarantiesFinancièresEnCoursSuppriméEvent */
export type DépôtGarantiesFinancièresEnCoursSuppriméEventV1 = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: Email.RawType;
  }
>;

export type DépôtGarantiesFinancièresEnCoursSuppriméEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: Email.RawType;
    garantiesFinancièresActuelles?: {
      type: Candidature.TypeGarantiesFinancières.RawType;
      dateÉchéance?: DateTime.RawType;
      dateConstitution?: DateTime.RawType;
      attestation?: { format: string };
    };
  }
>;
export type DépôtGarantiesFinancièresEvent =
  | DépôtGarantiesFinancièresEnCoursSuppriméEvent
  | DépôtGarantiesFinancièresEnCoursSuppriméEventV1
  | DépôtGarantiesFinancièresSoumisEvent
  | DépôtGarantiesFinancièresEnCoursValidéEventV1
  | DépôtGarantiesFinancièresEnCoursValidéEvent
  | DépôtGarantiesFinancièresEnCoursModifiéEvent;
