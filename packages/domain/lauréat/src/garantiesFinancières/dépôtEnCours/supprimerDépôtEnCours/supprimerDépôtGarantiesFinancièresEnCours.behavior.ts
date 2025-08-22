import type { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import type { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import type { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError } from '../aucunDépôtEnCoursGarantiesFinancièresPourLeProjet.error';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: IdentifiantUtilisateur.ValueType;
};

export async function supprimerDépôtGarantiesFinancièresEnCours(
  this: GarantiesFinancièresAggregate,
  { suppriméLe, identifiantProjet, suppriméPar }: Options,
) {
  if (!this.dépôtsEnCours) {
    throw new AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError();
  }

  const event: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent = {
    type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméLe: suppriméLe.formatter(),
      suppriméPar: suppriméPar.formatter(),
      garantiesFinancièresActuelles: this.actuelles
        ? {
            type: this.actuelles.type.type,
            dateÉchéance: this.actuelles.dateÉchéance?.formatter(),
            dateConstitution: this.actuelles.dateConstitution?.formatter(),
            attestation: this.actuelles.attestation,
          }
        : undefined,
    },
  };
  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresEnCoursSupprimé(
  this: GarantiesFinancièresAggregate,
  _:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent,
) {
  this.dépôtsEnCours = undefined;
}
