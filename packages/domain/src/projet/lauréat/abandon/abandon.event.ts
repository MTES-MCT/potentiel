import { DomainEvent } from '@potentiel/core-domain';

export type AbandonDemandéEvent = DomainEvent<
  'AbandonDemandé-V1',
  {
    demandéLe: string;
    identifiantProjet: string;
    raison: string;
    recandidature: boolean;
    piéceJustificative: {
      format: string;
    };
  }
>;

export type AbandonRejetéEvent = DomainEvent<
  'AbandonRejeté-V1',
  {
    rejetéLe: string;
    identifiantProjet: string;
    réponseSignée: {
      format: string;
    };
  }
>;

export type AbandonAccordéEvent = DomainEvent<
  'AbandonAccordé-V1',
  {
    acceptéLe: string;
    identifiantProjet: string;
    réponseSignée: {
      format: string;
    };
  }
>;

export type ConfirmationAbandonDemandéEvent = DomainEvent<
  'ConfirmationAbandonDemandé-V1',
  {
    confirmationDemandéLe: string;
    identifiantProjet: string;
    réponseSignée: {
      format: string;
    };
  }
>;

export type AbandonConfirméEvent = DomainEvent<
  'AbandonConfirmé-V1',
  {
    confirméLe: string;
    identifiantProjet: string;
  }
>;

export type AbandonEvent =
  | AbandonDemandéEvent
  | AbandonRejetéEvent
  | AbandonAccordéEvent
  | ConfirmationAbandonDemandéEvent
  | AbandonConfirméEvent;
