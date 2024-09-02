import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import * as IdentifiantPériode from '../identifiantPériode.valueType';

import { NotifierPériodeCommand } from './notifierPériode.command';

export type NotifierPériodeUseCase = Message<
  'Période.UseCase.NotifierPériode',
  {
    identifiantPériodeValue: string;
    notifiéeLeValue: DateTime.RawType;
    notifiéeParValue: Email.RawType;
    identifiantCandidatureValues: ReadonlyArray<string>;
  }
>;

export const registerNotifierPériodeUseCase = () => {
  const handler: MessageHandler<NotifierPériodeUseCase> = async ({
    identifiantPériodeValue,
    notifiéeLeValue,
    notifiéeParValue,
    identifiantCandidatureValues,
  }) => {
    const identifiantPériode = IdentifiantPériode.convertirEnValueType(identifiantPériodeValue);

    await mediator.send<NotifierPériodeCommand>({
      type: 'Période.Command.NotifierPériode',
      data: {
        identifiantPériode,
        notifiéeLe: DateTime.convertirEnValueType(notifiéeLeValue),
        notifiéePar: Email.convertirEnValueType(notifiéeParValue),
        identifiantCandidatures: identifiantCandidatureValues.map((identifiantCandidatureValue) =>
          IdentifiantProjet.convertirEnValueType(identifiantCandidatureValue),
        ),
      },
    });
  };

  mediator.register('Période.UseCase.NotifierPériode', handler);
};
