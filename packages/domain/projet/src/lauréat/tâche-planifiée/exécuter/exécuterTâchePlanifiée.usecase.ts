import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '../../..';

import { ExécuterTâchePlanifiéeCommand } from './exécuterTâchePlanifiée.command';

export type ExécuterTâchePlanifiéeUseCase = Message<
  'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
  {
    identifiantProjetValue: IdentifiantProjet.RawType;
    typeTâchePlanifiéeValue: string;
  }
>;

export const registerExécuterTâchePlanifiéeUseCase = () => {
  const handler: MessageHandler<ExécuterTâchePlanifiéeUseCase> = async ({
    identifiantProjetValue,
    typeTâchePlanifiéeValue,
  }) => {
    await mediator.send<ExécuterTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.ExécuterTâchePlanifiée',
      data: {
        typeTâchePlanifiée: typeTâchePlanifiéeValue,
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
      },
    });
  };
  mediator.register('System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée', handler);
};
