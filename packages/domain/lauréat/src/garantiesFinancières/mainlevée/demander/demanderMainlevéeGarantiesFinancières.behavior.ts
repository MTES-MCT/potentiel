import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import {
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
} from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AbandonAggregate } from '../../../abandon/abandon.aggregate';
import { AchèvementAggregate } from '../../../achèvement/achèvement.aggregate';

export type MainlevéeGarantiesFinancièresDemandéeEvent = DomainEvent<
  'MainlevéeGarantiesFinancièresDemandée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    motif: MotifDemandeMainlevéeGarantiesFinancières.RawType;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
  statutAbandon?: AbandonAggregate['statut'];
  achèvement?: AchèvementAggregate;
};

export async function demanderMainlevée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, motif, demandéLe, demandéPar, statutAbandon, achèvement }: Options,
) {
  if (motif.estProjetAbandonné() && !statutAbandon?.estAccordé()) {
    throw new ProjetNonAbandonnéError();
  }

  if (motif.estProjetAchevé() && !achèvement?.preuveTransmissionAuCocontractant?.format) {
    throw new ProjetNonAchevéError();
  }

  if (!this.actuelles) {
    throw new GarantiesFinancièresNonTrouvéesError();
  }

  if (this.actuelles.statut.estÉchu()) {
    throw new ProjetAveGarantiesFinancièresÉchuesError();
  }

  this.demandeMainlevéeEnCours?.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutMainlevéeGarantiesFinancières.demandé,
  );

  if (!this.actuelles.attestation?.format) {
    throw new AttestationConstitutionGarantiesFinancièresManquanteError();
  }

  if (this.dépôtsEnCours) {
    throw new DépôtDeGarantiesFinancièresÀSupprimerError();
  }

  const event: MainlevéeGarantiesFinancièresDemandéeEvent = {
    type: 'MainlevéeGarantiesFinancièresDemandée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      motif: motif.motif,
      demandéLe: demandéLe.formatter(),
      demandéPar: demandéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyMainlevéeGarantiesFinancièresDemandée(
  this: GarantiesFinancièresAggregate,
  _: MainlevéeGarantiesFinancièresDemandéeEvent,
) {
  this.demandeMainlevéeEnCours = {
    statut: StatutMainlevéeGarantiesFinancières.demandé,
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
      "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas en statut abandonné",
    );
  }
}

class ProjetNonAchevéError extends InvalidOperationError {
  constructor() {
    super(
      "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas achevé (attestation de conformité non transmise au co-contractant et dans Potentiel)",
    );
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

class ProjetAveGarantiesFinancièresÉchuesError extends InvalidOperationError {
  constructor() {
    super(
      'Votre demande de mainlevée de garanties financières est invalide car les garanties financières du projet sont échues',
    );
  }
}
