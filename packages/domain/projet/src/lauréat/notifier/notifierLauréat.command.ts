import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../..';
import { GarantiesFinancières } from '../garanties-financières';

export type NotifierLauréatCommand = Message<
  'Lauréat.Command.NotifierLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéLe: DateTime.ValueType;
    notifiéPar: Email.ValueType;
    attestation: { format: string };
    garantiesFinancières: GarantiesFinancières.ValueType | undefined;
  }
>;

export const registerNotifierLauréatCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<NotifierLauréatCommand> = async ({
    attestation,
    identifiantProjet,
    notifiéLe,
    notifiéPar,
    garantiesFinancières,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.notifier({
      attestation: { format: attestation.format },
      garantiesFinancières,
      notifiéLe,
      notifiéPar,
    });
  };

  mediator.register('Lauréat.Command.NotifierLauréat', handler);
};
