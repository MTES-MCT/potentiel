import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type ValiderDépôtGarantiesFinancièresEnCoursCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    validéLe: DateTime.ValueType;
    validéPar: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerValiderDépôtGarantiesFinancièresEnCoursCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<ValiderDépôtGarantiesFinancièresEnCoursCommand> = async ({
    identifiantProjet,
    validéLe,
    validéPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    await garantiesFinancières.validerDépôtEnCours({
      identifiantProjet,
      validéLe,
      validéPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
    handler,
  );
};
