import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type RejeterDemandeMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.RejeterDemandeMainlevée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registeRejeterDemandeMainlevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<RejeterDemandeMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.rejeterDemandeMainlevéeGarantiesFinancières({
      identifiantProjet,
      rejetéLe,
      rejetéPar,
      réponseSignée,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Command.RejeterDemandeMainlevée',
    handler,
  );
};
