import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type AnnulerMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.Annuler',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    annuléLe: DateTime.ValueType;
    annuléPar: Email.ValueType;
  }
>;

export const registerAnnulerMainlevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<AnnulerMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    annuléLe,
    annuléPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.annulerDemandeMainlevée({
      identifiantProjet,
      annuléLe,
      annuléPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Command.Annuler', handler);
};
