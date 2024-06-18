import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../../../garantiesFinancières.aggregate';
import { DocumentProjet } from '@potentiel-domain/document';
import {
  DemandeMainlevéeEnCoursNonTrouvéeError,
  MainlevéeAccordéeNonTrouvéeError,
} from '../../demandeMainlevéeNonTrouvée.error';

export type RéponseSignéeMainlevéeAccordéeModifiéeEvent = DomainEvent<
  'RéponseSignéeMainlevéeAccordéeModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
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
};

export async function modifierRéponseSignéeMainlevéeAccordée(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, nouvelleRéponseSignée, modifiéeLe, modifiéePar }: Options,
) {
  if (!this.demandeMainlevéeEnCours) {
    throw new DemandeMainlevéeEnCoursNonTrouvéeError();
  }

  if (!this.demandeMainlevéeEnCours.statut.estAccordé()) {
    throw new MainlevéeAccordéeNonTrouvéeError();
  }

  const event: RéponseSignéeMainlevéeAccordéeModifiéeEvent = {
    type: 'RéponseSignéeMainlevéeAccordéeModifiée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      modifiéeLe: modifiéeLe.formatter(),
      modifiéePar: modifiéePar.formatter(),
      nouvelleRéponseSignée: {
        format: nouvelleRéponseSignée.format,
      },
    },
  };

  await this.publish(event);
}
