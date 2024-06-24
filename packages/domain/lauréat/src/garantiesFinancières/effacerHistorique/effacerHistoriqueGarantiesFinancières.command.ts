import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { loadGarantiesFinancièresFactory } from '../garantiesFinancières.aggregate';

export type EffacerHistoriqueGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.EffacerHistoriqueGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    effacéPar: IdentifiantUtilisateur.ValueType;
    effacéLe: DateTime.ValueType;
  }
>;

export const registerEffacerHistoriqueGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<EffacerHistoriqueGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    effacéLe,
    effacéPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    await garantiesFinancières.effacerHistorique({
      identifiantProjet,
      effacéLe,
      effacéPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.EffacerHistoriqueGarantiesFinancières',
    handler,
  );
};
