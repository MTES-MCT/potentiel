import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type AnnulerMainLevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.MainLevée.Command.Annuler',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerMainLevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<AnnulerMainLevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.annulerMainLevée({
      identifiantProjet,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.Command.Annuler', handler);
};
