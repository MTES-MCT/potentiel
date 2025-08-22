import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type DémarrerInstructionDemandeMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.DémarrerInstruction',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    démarréLe: DateTime.ValueType;
    démarréPar: Email.ValueType;
  }
>;

export const registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<
    DémarrerInstructionDemandeMainlevéeGarantiesFinancièresCommand
  > = async ({ identifiantProjet, démarréLe, démarréPar }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.démarrerInstructionDemandeMainlevée({
      identifiantProjet,
      démarréLe,
      démarréPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Command.DémarrerInstruction', handler);
};
