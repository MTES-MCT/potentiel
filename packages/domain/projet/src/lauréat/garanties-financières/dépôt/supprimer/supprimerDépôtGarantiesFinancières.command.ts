import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../../../..';

export type SupprimerDépôtGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    suppriméLe: DateTime.ValueType;
    suppriméPar: Email.ValueType;
  }
>;

export const registerSupprimerDépôtGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    suppriméLe,
    suppriméPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.supprimerDépôt({
      suppriméLe,
      suppriméPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancières',
    handler,
  );
};
