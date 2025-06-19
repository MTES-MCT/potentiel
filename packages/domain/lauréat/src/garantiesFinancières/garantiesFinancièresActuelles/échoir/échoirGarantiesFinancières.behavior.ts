import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { StatutGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AucunesGarantiesFinancièresActuellesError } from '../aucunesGarantiesFinancièresActuelles.error';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  aUneAttestationDeConformité: boolean;
};

export async function échoir(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, aUneAttestationDeConformité }: Options,
) {
  if (!this.actuelles) {
    throw new AucunesGarantiesFinancièresActuellesError();
  }

  if (!this.actuelles.dateÉchéance) {
    throw new GarantiesFinancièresSansÉchéanceError(identifiantProjet.formatter());
  }

  const now = DateTime.now();
  if (!now.estUltérieureÀ(this.actuelles.dateÉchéance)) {
    throw new DateÉchéanceNonPasséeError();
  }

  if (this.actuelles.statut.estÉchu()) {
    throw new GarantiesFinancièresDéjàÉchuesError();
  }

  if (this.dépôtsEnCours) {
    throw new DépôtEnCoursError();
  }

  if (aUneAttestationDeConformité) {
    throw new AttestationDeConformitéError();
  }

  const event: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent = {
    type: 'GarantiesFinancièresÉchues-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateÉchéance: this.actuelles.dateÉchéance.formatter(),
      échuLe: now.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGarantiesFinancièresÉchues(
  this: GarantiesFinancièresAggregate,
  _: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent,
) {
  if (this.actuelles) {
    this.actuelles.statut = StatutGarantiesFinancières.échu;
  }
}

class DateÉchéanceNonPasséeError extends InvalidOperationError {
  constructor() {
    super(`La date d'échéance des garanties financières n'est pas encore passée`);
  }
}

class GarantiesFinancièresDéjàÉchuesError extends InvalidOperationError {
  constructor() {
    super(`Les garanties financières du projet sont déjà échues`);
  }
}

class DépôtEnCoursError extends InvalidOperationError {
  constructor() {
    super(
      `Le projet dispose d'un dépôt de garanties financières en attente de validation, ce qui empêche de pouvoir échoir ses garanties financières`,
    );
  }
}

class AttestationDeConformitéError extends InvalidOperationError {
  constructor() {
    super(
      `Le projet dispose d'une attestation de conformité, ce qui empêche de pouvoir échoir ses garanties financières`,
    );
  }
}
class GarantiesFinancièresSansÉchéanceError extends InvalidOperationError {
  constructor(identifiantProjet: IdentifiantProjet.RawType) {
    super(`Impossible d'échoir des garanties financières sans date d'échéance`, {
      identifiantProjet,
    });
  }
}
