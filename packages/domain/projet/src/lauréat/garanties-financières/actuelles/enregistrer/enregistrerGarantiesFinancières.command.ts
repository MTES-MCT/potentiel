import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import { GarantiesFinancières } from '../../index.js';

export type EnregistrerGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
  }
>;

export const registerEnregistrerGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    garantiesFinancières,
    enregistréLe,
    enregistréPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.enregistrer({
      garantiesFinancières,
      enregistréLe,
      enregistréPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
    handler,
  );
};
