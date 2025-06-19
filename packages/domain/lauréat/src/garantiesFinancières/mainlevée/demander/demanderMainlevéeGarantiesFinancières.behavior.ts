import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { StatutMainlevéeGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  motif: Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
  aUnePreuveTransmissionAuCocontractant: boolean;
  estAbandonné: boolean;
};

export async function demanderMainlevée(
  this: GarantiesFinancièresAggregate,
  {
    identifiantProjet,
    motif,
    demandéLe,
    demandéPar,
    estAbandonné,
    aUnePreuveTransmissionAuCocontractant,
  }: Options,
) {
  if (motif.estProjetAbandonné() && !estAbandonné) {
    throw new ProjetNonAbandonnéError();
  }

  if (motif.estProjetAchevé() && !aUnePreuveTransmissionAuCocontractant) {
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

  const event: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent = {
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
  _: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent,
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
