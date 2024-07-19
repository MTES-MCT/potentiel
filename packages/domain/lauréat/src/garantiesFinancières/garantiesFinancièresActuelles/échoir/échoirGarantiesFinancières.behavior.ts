import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import { StatutGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AucunesGarantiesFinancièresValidéesError } from '../aucunesGarantiesFinancièresValidéesError';

export type GarantiesFinancièresÉchuesEvent = DomainEvent<
  'GarantiesFinancièresÉchues-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateÉchéance: DateTime.RawType;
    échuLe: DateTime.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateÉchéance: DateTime.ValueType;
  échuLe: DateTime.ValueType;
  aUneAttestationDeConformité: boolean;
};

export async function échoir(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, dateÉchéance, échuLe, aUneAttestationDeConformité }: Options,
) {
  if (!this.actuelles) {
    throw new AucunesGarantiesFinancièresValidéesError();
  }

  if (échuLe.estAntérieurÀ(dateÉchéance) || échuLe.estÉgaleÀ(dateÉchéance)) {
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

  const event: GarantiesFinancièresÉchuesEvent = {
    type: 'GarantiesFinancièresÉchues-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateÉchéance: dateÉchéance?.formatter(),
      échuLe: échuLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGarantiesFinancièresÉchues(this: GarantiesFinancièresAggregate) {
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
