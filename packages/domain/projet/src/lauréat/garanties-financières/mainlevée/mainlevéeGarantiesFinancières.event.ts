import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { MotifDemandeMainlevéeGarantiesFinancières } from '../index.js';

export type MainlevéeGarantiesFinancièresEvent =
  | DemandeMainlevéeGarantiesFinancièresAccordéeEvent
  | DemandeMainlevéeGarantiesFinancièresAnnuléeEvent
  | MainlevéeGarantiesFinancièresDemandéeEvent
  | InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent
  | DemandeMainlevéeGarantiesFinancièresRejetéeEvent;

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
