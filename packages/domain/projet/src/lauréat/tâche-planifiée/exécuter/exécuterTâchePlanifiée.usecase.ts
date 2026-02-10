import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

import { ExécuterTâchePlanifiéeCommand } from './exécuterTâchePlanifiée.command.js';

export type ExécuterTâchePlanifiéeUseCase = Message<
  'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
  {
    identifiantProjetValue: string;
    typeTâchePlanifiéeValue: string;
    exécutéeLeValue: string;
  }
>;

export const registerExécuterTâchePlanifiéeUseCase = () => {
  const handler: MessageHandler<ExécuterTâchePlanifiéeUseCase> = async ({
    identifiantProjetValue,
    typeTâchePlanifiéeValue,
    exécutéeLeValue: exécutéeLe,
  }) => {
    await mediator.send<ExécuterTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.ExécuterTâchePlanifiée',
      data: {
        typeTâchePlanifiée: typeTâchePlanifiéeValue,
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        exécutéeLe: DateTime.convertirEnValueType(exécutéeLe),
      },
    });
  };
  mediator.register('System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée', handler);
};
