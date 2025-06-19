import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { Candidature, IdentifiantProjet } from '../..';

import { MotifDemandeGarantiesFinancières, MotifDemandeMainlevéeGarantiesFinancières } from '.';

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

/**
 * @deprecated Utilisez DépôtGarantiesFinancièresEnCoursSuppriméEvent à la place.
 * Cet event a été conservé pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
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

export type GarantiesFinancièresDemandéesEvent = DomainEvent<
  'GarantiesFinancièresDemandées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateLimiteSoumission: DateTime.RawType;
    demandéLe: DateTime.RawType;
    motif: MotifDemandeGarantiesFinancières.RawType;
  }
>;

export type DépôtGarantiesFinancièresEnCoursModifiéEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursModifié-V1',
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

export type DépôtGarantiesFinancièresSoumisEvent = DomainEvent<
  'DépôtGarantiesFinancièresSoumis-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    soumisLe: DateTime.RawType;
    soumisPar: Email.RawType;
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

export type TypeGarantiesFinancièresImportéEvent = DomainEvent<
  'TypeGarantiesFinancièresImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: Candidature.TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    importéLe: DateTime.RawType;
  }
>;

export type DemandeMainlevéeGarantiesFinancièresAccordéeEvent = DomainEvent<
  'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

export type DemandeMainlevéeGarantiesFinancièresAnnuléeEvent = DomainEvent<
  'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
  }
>;

export type MainlevéeGarantiesFinancièresDemandéeEvent = DomainEvent<
  'MainlevéeGarantiesFinancièresDemandée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    motif: MotifDemandeMainlevéeGarantiesFinancières.RawType;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
  }
>;

export type InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent = DomainEvent<
  'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    démarréLe: DateTime.RawType;
    démarréPar: Email.RawType;
  }
>;

export type DemandeMainlevéeGarantiesFinancièresRejetéeEvent = DomainEvent<
  'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

export type GarantiesFinancièresEvent =
  | DépôtGarantiesFinancièresEnCoursValidéEventV1
  | DépôtGarantiesFinancièresEnCoursValidéEvent
  | GarantiesFinancièresEnregistréesEvent
  | GarantiesFinancièresModifiéesEvent
  | HistoriqueGarantiesFinancièresEffacéEvent
  | DépôtGarantiesFinancièresEnCoursSuppriméEventV1
  | DépôtGarantiesFinancièresEnCoursSuppriméEvent
  | GarantiesFinancièresDemandéesEvent
  | DépôtGarantiesFinancièresEnCoursModifiéEvent
  | DépôtGarantiesFinancièresSoumisEvent
  | GarantiesFinancièresÉchuesEvent
  | AttestationGarantiesFinancièresEnregistréeEvent
  | TypeGarantiesFinancièresImportéEvent
  | DemandeMainlevéeGarantiesFinancièresAccordéeEvent
  | DemandeMainlevéeGarantiesFinancièresAnnuléeEvent
  | MainlevéeGarantiesFinancièresDemandéeEvent
  | InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent
  | DemandeMainlevéeGarantiesFinancièresRejetéeEvent;
