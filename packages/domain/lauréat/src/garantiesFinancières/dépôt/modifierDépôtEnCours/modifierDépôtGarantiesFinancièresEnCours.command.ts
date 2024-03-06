import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { TypeGarantiesFinancières } from '../..';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type ModifierDépôtGarantiesFinancièresEnCoursCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: TypeGarantiesFinancières.ValueType;
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
