import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { DocumentProjet } from '@potentiel-domain/document';
import {
  DemandeMainlevéeEnCoursNonTrouvéeError,
  HistoriqueMainlevéeRejetéeNonTrouvéError,
  MainlevéeAccordéeNonTrouvéeError,
  MainlevéeRejetéeNonTrouvéeError,
} from '../mainlevée.error';

export type RéponseSignéeMainlevéeAccordéeModifiéeEvent = DomainEvent<
  'RéponseSignéeMainlevéeModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
    rejetéeLe?: DateTime.RawType;
    nouvelleRéponseSignée: {
      format: string;
    };
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nouvelleRéponseSignée: DocumentProjet.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
  rejetéeLe?: DateTime.ValueType;
};

export async function modifierRéponseSignéeMainlevéeAccordée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, nouvelleRéponseSignée, modifiéeLe, modifiéePar, rejetéeLe }: Options,
) {
  const isAMainlevéeRejetéeModification = rejetéeLe !== undefined;

  if (isAMainlevéeRejetéeModification) {
    if (!this.historiqueMainlevéeRejetée) {
      throw new HistoriqueMainlevéeRejetéeNonTrouvéError();
    }

    if (!this.historiqueMainlevéeRejetée.includes({ rejetéeLe })) {
      throw new MainlevéeRejetéeNonTrouvéeError();
    }
  } else {
    if (!this.demandeMainlevéeEnCours) {
      throw new DemandeMainlevéeEnCoursNonTrouvéeError();
    }

    if (!this.demandeMainlevéeEnCours.statut.estAccordé()) {
      throw new MainlevéeAccordéeNonTrouvéeError();
    }
  }

  const event: RéponseSignéeMainlevéeAccordéeModifiéeEvent = {
    type: 'RéponseSignéeMainlevéeModifiée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      modifiéeLe: modifiéeLe.formatter(),
      modifiéePar: modifiéePar.formatter(),
      rejetéeLe: rejetéeLe?.formatter(),
      nouvelleRéponseSignée: {
        format: nouvelleRéponseSignée.format,
      },
    },
  };

  await this.publish(event);
}
