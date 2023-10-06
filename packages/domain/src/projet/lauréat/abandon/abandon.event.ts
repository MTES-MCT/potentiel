import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../../projet.valueType';
import { RawIdentifiantUtilisateur } from '../../../utilisateur/utilisateur.valueType';

export type AbandonDemandéEvent = DomainEvent<
  'AbandonDemandé-V1',
  {
    demandéLe: string;
    demandéPar: RawIdentifiantUtilisateur;
    identifiantProjet: RawIdentifiantProjet;
    raison: string;
    recandidature: boolean;
    piéceJustificative?: {
      format: string;
    };
  }
>;

export type AbandonAnnuléEvent = DomainEvent<
  'AbandonAnnulé-V1',
  {
    annuléLe: string;
    annuléPar: RawIdentifiantUtilisateur;
    identifiantProjet: RawIdentifiantProjet;
  }
>;

export type AbandonRejetéEvent = DomainEvent<
  'AbandonRejeté-V1',
  {
    rejetéLe: string;
    rejetéPar: RawIdentifiantUtilisateur;
    identifiantProjet: RawIdentifiantProjet;
    réponseSignée: {
      format: string;
    };
  }
>;

export type AbandonAccordéEvent = DomainEvent<
  'AbandonAccordé-V1',
  {
    acceptéLe: string;
    acceptéPar: RawIdentifiantUtilisateur;
    identifiantProjet: RawIdentifiantProjet;
    réponseSignée: {
      format: string;
    };
  }
>;

export type ConfirmationAbandonDemandéEvent = DomainEvent<
  'ConfirmationAbandonDemandé-V1',
  {
    confirmationDemandéLe: string;
    confirmationDemandéPar: RawIdentifiantUtilisateur;
    identifiantProjet: RawIdentifiantProjet;
    réponseSignée: {
      format: string;
    };
  }
>;

export type AbandonConfirméEvent = DomainEvent<
  'AbandonConfirmé-V1',
  {
    confirméLe: string;
    confirméPar: RawIdentifiantUtilisateur;
    identifiantProjet: RawIdentifiantProjet;
  }
>;

export type AbandonEvent =
  | AbandonDemandéEvent
  | AbandonAnnuléEvent
  | AbandonRejetéEvent
  | AbandonAccordéEvent
  | ConfirmationAbandonDemandéEvent
  | AbandonConfirméEvent;
