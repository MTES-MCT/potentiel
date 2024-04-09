import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError } from '../../aucunDépôtEnCoursGarantiesFinancièresPourLeProjet.error';

export type DépôtGarantiesFinancièresEnCoursValidéEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursValidé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    validéLe: DateTime.RawType;
    validéPar: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  validéLe: DateTime.ValueType;
  validéPar: IdentifiantUtilisateur.ValueType;
};

export async function validerDépôtEnCours(
  this: GarantiesFinancièresAggregate,
  { validéLe, identifiantProjet, validéPar }: Options,
) {
  if (!this.dépôts?.some((dépôt) => dépôt.statut.estEnCours())) {
    throw new AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError();
  }
  const event: DépôtGarantiesFinancièresEnCoursValidéEvent = {
    type: 'DépôtGarantiesFinancièresEnCoursValidé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      validéLe: validéLe.formatter(),
      validéPar: validéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresEnCoursValidé(
  this: GarantiesFinancièresAggregate,
  { payload: { validéLe } }: DépôtGarantiesFinancièresEnCoursValidéEvent,
) {
  const dépôtValidé = this.dépôts && this.dépôts.find((dépôt) => dépôt.statut.estEnCours());

  this.actuelles = {
    type: dépôtValidé ? dépôtValidé.type : 'type-inconnu',
    ...(dépôtValidé && dépôtValidé.dateÉchéance && { dateÉchéance: dépôtValidé!.dateÉchéance }),
    dateConstitution: dépôtValidé && dépôtValidé.dateConstitution,
    validéLe: DateTime.convertirEnValueType(validéLe),
    attestation: dépôtValidé && dépôtValidé.attestation,
  };
  this.dépôts = this.dépôts && this.dépôts.filter((dépôt) => !dépôt.statut.estEnCours());
}
