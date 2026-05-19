import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';

export type RejeterMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.RejeterMainlevée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerRejeterMainlevéeGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RejeterMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.garantiesFinancières.rejeterMainlevée({
      rejetéLe,
      rejetéPar,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.RejeterMainlevée', handler);
};
