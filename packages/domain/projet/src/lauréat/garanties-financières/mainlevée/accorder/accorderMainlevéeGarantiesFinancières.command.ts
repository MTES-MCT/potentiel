import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AccorderMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.AccorderMainlevée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderMainlevéeGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AccorderMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.accorderMainlevée({
      accordéLe,
      accordéPar,
      réponseSignée,
    });

    // TODO move to Garanties Financière Aggregate
    await projet.lauréat.garantiesFinancières.annulerTâchesPlanififées();
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.AccorderMainlevée', handler);
};
