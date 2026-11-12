import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import type { InitierAchèvementCommand } from './initierAchèvement.command.js';

export type InitierAchèvementUseCase = Message<
  'Lauréat.Achèvement.UseCase.InitierAchèvement',
  {
    identifiantProjetValue: string;
    initiéLeValue: string;
    initiéParValue: string;
  }
>;

export const registerInitierAchèvementUseCase = () => {
  const runner: MessageHandler<InitierAchèvementUseCase> = async ({
    identifiantProjetValue,
    initiéLeValue,
    initiéParValue,
  }) => {
    await mediator.send<InitierAchèvementCommand>({
      type: 'Lauréat.Achèvement.Command.InitierAchèvement',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        initiéLe: DateTime.convertirEnValueType(initiéLeValue),
        initiéPar: Email.convertirEnValueType(initiéParValue),
      },
    });
  };

  mediator.register('Lauréat.Achèvement.UseCase.InitierAchèvement', runner);
};
