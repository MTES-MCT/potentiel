import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import type { CorrigerDateAchèvementCommand } from './corrigerDateAchèvement.command.js';

export type CorrigerDateAchèvementUseCase = Message<
  'Lauréat.Achèvement.UseCase.CorrigerDateAchèvement',
  {
    identifiantProjetValue: string;
    dateAchèvementValue: string;
    corrigéeLeValue: string;
    corrigéeParValue: string;
  }
>;

export const registerCorrigerDateAchèvementUseCase = () => {
  const runner: MessageHandler<CorrigerDateAchèvementUseCase> = async ({
    identifiantProjetValue,
    dateAchèvementValue,
    corrigéeLeValue,
    corrigéeParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const dateAchèvement = DateTime.convertirEnValueType(dateAchèvementValue);
    const corrigéeLe = DateTime.convertirEnValueType(corrigéeLeValue);
    const corrigéePar = Email.convertirEnValueType(corrigéeParValue);

    await mediator.send<CorrigerDateAchèvementCommand>({
      type: 'Lauréat.Achèvement.Command.CorrigerDateAchèvement',
      data: {
        identifiantProjet,
        dateAchèvement,
        corrigéeLe,
        corrigéePar,
      },
    });
  };

  mediator.register('Lauréat.Achèvement.UseCase.CorrigerDateAchèvement', runner);
};
