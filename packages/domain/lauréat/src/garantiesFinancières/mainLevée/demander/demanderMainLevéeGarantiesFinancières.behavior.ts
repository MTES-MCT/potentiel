import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import {
  MotifDemandeMainLevéeGarantiesFinancières,
  StatutMainLevéeGarantiesFinancières,
} from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AbandonAggregate } from '../../../abandon/abandon.aggregate';
import { AchèvementAggregate } from '../../../achèvement/achèvement.aggregate';

export type MainLevéeGarantiesFinancièresDemandéeEvent = DomainEvent<
  'MainLevéeGarantiesFinancièresDemandée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    motif: MotifDemandeMainLevéeGarantiesFinancières.RawMotif;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  motif: MotifDemandeMainLevéeGarantiesFinancières.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
  statutAbandon?: AbandonAggregate['statut'];
  achèvement?: AchèvementAggregate;
};

export async function demanderMainLevée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, motif, demandéLe, demandéPar, statutAbandon, achèvement }: Options,
) {
  if (motif.estProjetAbandonné() && !statutAbandon?.estAccordé()) {
    throw new ProjetNonAbandonnéError();
  }

  if (motif.estProjetAchevé() && !achèvement?.preuveTransmissionAuCocontractant.format) {
    throw new ProjetNonAchevéError();
  }

  if (!this.actuelles) {
    throw new GarantiesFinancièresNonTrouvéesError();
  }

  if (this.mainLevée?.statut.estDemandé()) {
    throw new MainLevéeDéjàDemandéeError();
  }

  if (!this.actuelles.attestation?.format) {
    throw new AttestationConstitutionGarantiesFinancièresManquanteError();
  }

  if (this.dépôtsEnCours) {
    throw new DépôtDeGarantiesFinancièresÀSupprimerError();
  }

  const event: MainLevéeGarantiesFinancièresDemandéeEvent = {
    type: 'MainLevéeGarantiesFinancièresDemandée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      motif: motif.motif,
      demandéLe: demandéLe.formatter(),
      demandéPar: demandéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyMainLevéeGarantiesFinancièresDemandée(
  this: GarantiesFinancièresAggregate,
  { payload: { motif, demandéLe, demandéPar } }: MainLevéeGarantiesFinancièresDemandéeEvent,
) {
  this.mainLevée = {
    motif: MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(motif),
    statut: StatutMainLevéeGarantiesFinancières.demandé,
    demande: {
      demandéLe: DateTime.convertirEnValueType(demandéLe),
      demandéPar: Email.convertirEnValueType(demandéPar),
    },
  };
}

class GarantiesFinancièresNonTrouvéesError extends InvalidOperationError {
  constructor() {
    super("Il n'y a pas de garanties financières à lever pour ce projet");
  }
}

class ProjetNonAbandonnéError extends InvalidOperationError {
  constructor() {
    super(
      "Votre demande de main-levée de garanties financières est invalide car le projet n'est pas en statut abandonné",
    );
  }
}

class ProjetNonAchevéError extends InvalidOperationError {
  constructor() {
    super(
      "Votre demande de main-levée de garanties financières est invalide car le projet n'est pas achevé (attestation de conformité non transmise au co-contractant et dans Potentiel)",
    );
  }
}

class MainLevéeDéjàDemandéeError extends InvalidOperationError {
  constructor() {
    super('Il y a déjà une demande de main-levée pour ce projet');
  }
}

class AttestationConstitutionGarantiesFinancièresManquanteError extends InvalidOperationError {
  constructor() {
    super(
      "Votre demande n'a pas pu être enregistrée car l'attestation de constitution de vos garanties financières reste à transmettre dans Potentiel",
    );
  }
}

class DépôtDeGarantiesFinancièresÀSupprimerError extends InvalidOperationError {
  constructor() {
    super(
      "Vous avez de nouvelles garanties financières à traiter pour ce projet. Pour demander la levée des garanties financières déjà validées vous devez d'abord annuler le dernier dépôt en attente de validation.",
    );
  }
}
