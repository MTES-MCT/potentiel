import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';

import * as IdentifiantPériode from '../identifiantPériode.valueType';

import { NotifierPériodeCommand } from './notifierPériode.command';

export type NotifierPériodeUseCase = Message<
  'Période.UseCase.NotifierPériode',
  {
    identifiantPériodeValue: string;
    candidats: ReadonlyArray<string>;
  }
>;

export const registerNotifierPériodeUseCase = () => {
  const handler: MessageHandler<NotifierPériodeUseCase> = async ({
    identifiantPériodeValue,
    candidats,
  }) => {
    const identifiantPériode = IdentifiantPériode.convertirEnValueType(identifiantPériodeValue);

    await mediator.send<NotifierPériodeCommand>({
      type: 'Période.Command.NotifierPériode',
      data: {
        identifiantPériode,
        candidats: candidats.map((candidat) => IdentifiantProjet.convertirEnValueType(candidat)),
      },
    });
  };

  mediator.register('Période.UseCase.NotifierPériode', handler);
};
