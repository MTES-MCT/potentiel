import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/projet';

import { StatutGarantiesFinancières } from '../..';
import { DateConstitutionDansLeFuturError } from '../../dateConstitutionDansLeFutur.error';
import { DateÉchéanceManquanteError } from '../../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendueError } from '../../dateÉchéanceNonAttendue.error';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { GarantiesFinancièresDéjàLevéesError } from '../../garantiesFinancièresDéjàLevées.error';
import { AucunesGarantiesFinancièresActuellesError } from '../aucunesGarantiesFinancièresActuelles.error';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  type: Candidature.TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  attestation: { format: string };
  dateConstitution: DateTime.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: IdentifiantUtilisateur.ValueType;
};

export async function modifier(
  this: GarantiesFinancièresAggregate,
  {
    attestation,
    dateConstitution,
    identifiantProjet,
    type,
    dateÉchéance,
    modifiéLe,
    modifiéPar,
  }: Options,
) {
  if (!this.actuelles) {
    throw new AucunesGarantiesFinancièresActuellesError();
  }
  if (this.actuelles.statut.estLevé()) {
    throw new GarantiesFinancièresDéjàLevéesError();
  }
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquanteError();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendueError();
  }
  if (dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionDansLeFuturError();
  }

  const event: Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent = {
    type: 'GarantiesFinancièresModifiées-V1',
    payload: {
      attestation: { format: attestation.format },
      dateConstitution: dateConstitution.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      modifiéLe: modifiéLe.formatter(),
      modifiéPar: modifiéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyModifierGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, dateConstitution, attestation },
  }: Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent,
) {
  this.actuelles = {
    statut: StatutGarantiesFinancières.validé,
    ...this.actuelles,
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
  };
}
