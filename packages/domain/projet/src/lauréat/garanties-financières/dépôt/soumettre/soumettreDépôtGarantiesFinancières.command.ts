import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../../../getProjetAggregateRoot.port';
import { GarantiesFinancières } from '../..';

export type SoumettreDépôtGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
    soumisLe: DateTime.ValueType;
    soumisPar: Email.ValueType;
  }
>;

export const registerSoumettreDépôtGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SoumettreDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    soumisLe,
    garantiesFinancières,
    soumisPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.soumettreDépôt({
      garantiesFinancières,
      soumisLe,
      soumisPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
    handler,
  );
};
