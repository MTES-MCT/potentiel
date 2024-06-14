import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { DocumentProjet } from '@potentiel-domain/document';

export type AccorderDemandeMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.AccorderDemandeMainlevée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registeAccorderDemandeMainlevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<AccorderDemandeMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.accorderDemandeMainlevéeGarantiesFinancières({
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Command.AccorderDemandeMainlevée',
    handler,
  );
};
