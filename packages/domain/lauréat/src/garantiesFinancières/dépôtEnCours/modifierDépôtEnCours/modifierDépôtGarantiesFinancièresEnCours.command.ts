import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';
import type { DocumentProjet } from '@potentiel-domain/document';
import type { Candidature } from '@potentiel-domain/projet';
import type { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type ModifierDépôtGarantiesFinancièresEnCoursCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: Candidature.TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerModifierDépôtGarantiesFinancièresEnCoursCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<ModifierDépôtGarantiesFinancièresEnCoursCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    type,
    dateÉchéance,
    modifiéLe,
    modifiéPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.modifierDépôtGarantiesFinancièresEnCours({
      identifiantProjet,
      attestation,
      dateConstitution,
      type,
      dateÉchéance,
      modifiéLe,
      modifiéPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
    handler,
  );
};
