import { Message, MessageHandler, mediator } from 'mediateur';
import { AnnulerAbandonCommand } from './annulerAbandon.command';
import { AbandonCommand } from '../abandon.command';

type AnnulerAbandonUseCaseData = AnnulerAbandonCommand['data'];

export type AnnulerAbandonUseCase = Message<'ANNULER_ABANDON_USECASE', AnnulerAbandonUseCaseData>;

export const registerAnnulerAbandonUseCase = () => {
  const runner: MessageHandler<AnnulerAbandonUseCase> = async ({
    identifiantProjet,
    dateAnnulationAbandon,
  }) => {
    await mediator.send<AbandonCommand>({
      type: 'ANNULER_ABANDON_COMMAND',
      data: {
        identifiantProjet,
        dateAnnulationAbandon,
      },
    });
  };
  mediator.register('ANNULER_ABANDON_USECASE', runner);
};
