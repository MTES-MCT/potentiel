import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type AnnulerMainLevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.MainLevée.Command.Annuler',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    annuléLe: DateTime.ValueType;
    annuléPar: Email.ValueType;
  }
>;

export const registerAnnulerMainLevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<AnnulerMainLevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    annuléLe,
    annuléPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.annulerMainLevée({
      identifiantProjet,
      annuléLe,
      annuléPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.Command.Annuler', handler);
};
