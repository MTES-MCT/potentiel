import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type AccorderDemandeMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.AccorderDemandeMainlevée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéeLe: DateTime.ValueType;
    accordéePar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registeAccorderDemandeMainlevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<AccorderDemandeMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    accordéeLe,
    accordéePar,
    réponseSignée,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.accorderDemandeMainlevéeGarantiesFinancières({
      identifiantProjet,
      accordéeLe,
      accordéePar,
      réponseSignée,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Command.AccorderDemandeMainlevée',
    handler,
  );
};
