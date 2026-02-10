import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import * as IdentifiantPériode from '../identifiantPériode.valueType.js';

import { NotifierPériodeCommand } from './notifierPériode.command.js';

export type NotifierPériodeUseCase = Message<
  'Période.UseCase.NotifierPériode',
  {
    identifiantPériodeValue: IdentifiantPériode.RawType;
    notifiéeLeValue: DateTime.RawType;
    notifiéeParValue: Email.RawType;
    validateurValue: AppelOffre.Validateur;
    identifiantCandidatureValues: ReadonlyArray<IdentifiantProjet.RawType>;
  }
>;

export const registerNotifierPériodeUseCase = () => {
  const handler: MessageHandler<NotifierPériodeUseCase> = async ({
    identifiantPériodeValue,
    notifiéeLeValue,
    notifiéeParValue,
    validateurValue,
    identifiantCandidatureValues,
  }) => {
    const identifiantPériode = IdentifiantPériode.convertirEnValueType(identifiantPériodeValue);

    await mediator.send<NotifierPériodeCommand>({
      type: 'Période.Command.NotifierPériode',
      data: {
        identifiantPériode,
        notifiéeLe: DateTime.convertirEnValueType(notifiéeLeValue),
        notifiéePar: Email.convertirEnValueType(notifiéeParValue),
        validateur: validateurValue,
        identifiantCandidatures: identifiantCandidatureValues.map((identifiantCandidatureValue) =>
          IdentifiantProjet.convertirEnValueType(identifiantCandidatureValue),
        ),
      },
    });
  };

  mediator.register('Période.UseCase.NotifierPériode', handler);
};
