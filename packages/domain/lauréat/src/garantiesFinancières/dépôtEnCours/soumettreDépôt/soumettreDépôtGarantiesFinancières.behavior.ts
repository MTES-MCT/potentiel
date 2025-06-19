import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { DateConstitutionDansLeFuturError } from '../../dateConstitutionDansLeFutur.error';
import { DateÉchéanceManquanteError } from '../../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendueError } from '../../dateÉchéanceNonAttendue.error';
import { GarantiesFinancièresDéjàLevéesError } from '../../garantiesFinancièresDéjàLevées.error';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  type: Candidature.TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  attestation: DocumentProjet.ValueType;
  dateConstitution: DateTime.ValueType;
  soumisLe: DateTime.ValueType;
  soumisPar: IdentifiantUtilisateur.ValueType;
};

export async function soumettreDépôt(
  this: GarantiesFinancièresAggregate,
  {
    attestation,
    dateConstitution,
    identifiantProjet,
    soumisLe,
    type,
    dateÉchéance,
    soumisPar,
  }: Options,
) {
  if (this.dépôtsEnCours) {
    throw new DépôtGarantiesFinancièresDéjàSoumisError();
  }
  if (dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionDansLeFuturError();
  }
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquanteError();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendueError();
  }
  if (this.demandeMainlevéeEnCours?.statut.estDemandé()) {
    throw new DemandeMainlevéeDemandéeError();
  }
  if (this.demandeMainlevéeEnCours?.statut.estEnInstruction()) {
    throw new DemandeMainlevéeEnInstructionError();
  }
  if (this.actuelles?.statut.estLevé()) {
    throw new GarantiesFinancièresDéjàLevéesError();
  }

  const event: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent = {
    type: 'DépôtGarantiesFinancièresSoumis-V1',
    payload: {
      attestation: { format: attestation.format },
      dateConstitution: dateConstitution.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      soumisLe: soumisLe.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      soumisPar: soumisPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresSoumis(
  this: GarantiesFinancièresAggregate,
  {
    payload: { attestation, dateConstitution, soumisLe, type, dateÉchéance },
  }: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent,
) {
  this.dépôtsEnCours = {
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    soumisLe: DateTime.convertirEnValueType(soumisLe),
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    attestation,
  };
}

class DépôtGarantiesFinancièresDéjàSoumisError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà des garanties financières en attente de validation pour ce projet`);
  }
}

class DemandeMainlevéeDemandéeError extends InvalidOperationError {
  constructor() {
    super(
      'Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une demande de mainlevée de garanties financières en cours',
    );
  }
}

class DemandeMainlevéeEnInstructionError extends InvalidOperationError {
  constructor() {
    super(
      `Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une mainlevée de garanties financières en cours d'instruction`,
    );
  }
}
