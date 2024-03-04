import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError, NotFoundError } from '@potentiel-domain/core';

import { TypeGarantiesFinancières } from '..';
import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';
import { DateConstitutionDansLeFutur } from '../dateConstitutionDansLeFutur.error';
import { DateÉchéanceManquante } from '../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendue } from '../dateÉchéanceNonAttendue.error';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';

export type GarantiesFinancièresComplétéesEvent = DomainEvent<
  'GarantiesFinancièresComplétées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    complétéLe: DateTime.RawType;
    identifiantUtilisateur: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  type: TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  attestation: { format: string };
  dateConstitution: DateTime.ValueType;
  complétéLe: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  rôleUtilisateur: Role.ValueType;
};

export async function compléter(
  this: GarantiesFinancièresAggregate,
  {
    attestation,
    dateConstitution,
    identifiantProjet,
    type,
    dateÉchéance,
    complétéLe,
    identifiantUtilisateur,
    rôleUtilisateur,
  }: Options,
) {
  if (!this.validées) {
    throw new AucunesGarantiesFinancièresValidées();
  }
  if (this.validées.type !== type && rôleUtilisateur.nom === 'porteur-projet') {
    throw new TypeGarantiesFinancièresNonModifiableParRôle();
  }
  if (
    dateÉchéance &&
    rôleUtilisateur.nom === 'porteur-projet' &&
    (!this.validées.dateÉchéance ||
      this.validées.dateÉchéance.formatter() !== dateÉchéance.formatter())
  ) {
    throw new DateÉchéanceGarantiesFinancièresNonModifiableParRôle();
  }
  if (dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionDansLeFutur();
  }
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquante();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendue();
  }

  const event: GarantiesFinancièresComplétéesEvent = {
    type: 'GarantiesFinancièresComplétées-V1',
    payload: {
      attestation: { format: attestation.format },
      dateConstitution: dateConstitution.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      complétéLe: complétéLe.formatter(),
      identifiantUtilisateur: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyCompléterGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { payload: { type, dateÉchéance, dateConstitution } }: GarantiesFinancièresComplétéesEvent,
) {
  this.validées = {
    ...this.validées,
    type: TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
  };
}

class AucunesGarantiesFinancièresValidées extends NotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières validées pour ce projet`);
  }
}

class TypeGarantiesFinancièresNonModifiableParRôle extends InvalidOperationError {
  constructor() {
    super(`Vous n'êtes pas autorisé à modifier le type de garanties financières déjà validées`);
  }
}

class DateÉchéanceGarantiesFinancièresNonModifiableParRôle extends InvalidOperationError {
  constructor() {
    super(
      `Vous n'êtes pas autorisé à modifier la date d'échéance de garanties financières déjà validées`,
    );
  }
}
