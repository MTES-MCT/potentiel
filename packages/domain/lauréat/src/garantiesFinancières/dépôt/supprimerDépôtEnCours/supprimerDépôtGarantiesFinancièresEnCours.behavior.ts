import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError } from '../../aucunDépôtEnCoursGarantiesFinancièresPourLeProjet.error';

export type DépôtGarantiesFinancièresEnCoursSuppriméEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: IdentifiantUtilisateur.ValueType;
};

export async function supprimerDépôtGarantiesFinancièresEnCours(
  this: GarantiesFinancièresAggregate,
  { suppriméLe, identifiantProjet, suppriméPar }: Options,
) {
  if (!this.dépôts?.some((dépôt) => dépôt.statut.estEnCours())) {
    throw new AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError();
  }
  const event: DépôtGarantiesFinancièresEnCoursSuppriméEvent = {
    type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméLe: suppriméLe.formatter(),
      suppriméPar: suppriméPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresEnCoursSupprimé(this: GarantiesFinancièresAggregate) {
  this.dépôts = this.dépôts?.filter((dépôt) => !dépôt.statut.estEnCours());
}
