import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../../../..';

export type ValiderDépôtGarantiesFinancièresEnCoursCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    validéLe: DateTime.ValueType;
    validéPar: Email.ValueType;
  }
>;

export const registerValiderDépôtGarantiesFinancièresEnCoursCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ValiderDépôtGarantiesFinancièresEnCoursCommand> = async ({
    identifiantProjet,
    validéLe,
    validéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.garantiesFinancières.validerDépôt({
      validéLe,
      validéPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
    handler,
  );
};
