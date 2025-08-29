import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '../../..';

import { AnnulerTâchePlanifiéeCommand } from './annulerTâchePlanifiée.command';

export type AnnulerTâchePlanifiéeUseCase = Message<
  'System.TâchePlanifiée.UseCase.AnnulerTâchePlanifiée',
  {
    identifiantProjetValue: string;
    typeTâchePlanifiéeValue: string;
  }
>;

export const registerAnnulerTâchePlanifiéeUseCase = () => {
  const handler: MessageHandler<AnnulerTâchePlanifiéeUseCase> = async ({
    identifiantProjetValue,
    typeTâchePlanifiéeValue,
  }) => {
    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        typeTâchePlanifiée: typeTâchePlanifiéeValue,
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
      },
    });
  };
  mediator.register('System.TâchePlanifiée.UseCase.AnnulerTâchePlanifiée', handler);
};
