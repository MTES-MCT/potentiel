import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError } from '../aucunDépôtEnCoursGarantiesFinancièresPourLeProjet.error';
import { GarantiesFinancièresDemandéesEvent } from '../../demander/demanderGarantiesFinancières.behavior';

/**
 * @deprecated Utilisez DépôtGarantiesFinancièresEnCoursSuppriméEvent à la place.
 * Cet event a été conservé pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DépôtGarantiesFinancièresEnCoursSuppriméEventV1 = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: IdentifiantUtilisateur.RawType;
  }
>;

export type DépôtGarantiesFinancièresEnCoursSuppriméEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: IdentifiantUtilisateur.RawType;
    garantiesFinancièresActuelles?: {
      type: Candidature.TypeGarantiesFinancières.RawType;
      dateÉchéance?: DateTime.RawType;
      dateConstitution?: DateTime.RawType;
      attestation?: { format: string };
    };
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
  if (!this.dépôtsEnCours) {
    throw new AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError();
  }

  const event: DépôtGarantiesFinancièresEnCoursSuppriméEvent = {
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

  if (this.dateLimiteSoumission) {
    const event: GarantiesFinancièresDemandéesEvent = {
      type: 'GarantiesFinancièresDemandées-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe: suppriméLe.formatter(),
        dateLimiteSoumission: this.dateLimiteSoumission.formatter(),
        motif: this.motifDemandeGarantiesFinancières.motif,
      },
    };
    await this.publish(event);
  }
}

export function applyDépôtGarantiesFinancièresEnCoursSupprimé(
  this: GarantiesFinancièresAggregate,
  _:
    | DépôtGarantiesFinancièresEnCoursSuppriméEventV1
    | DépôtGarantiesFinancièresEnCoursSuppriméEvent,
) {
  this.dépôtsEnCours = undefined;
}
