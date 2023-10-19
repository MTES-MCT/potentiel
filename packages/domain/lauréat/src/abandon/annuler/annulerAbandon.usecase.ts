import { Message, MessageHandler, mediator } from 'mediateur';
import { AnnulerAbandonCommand } from './annulerAbandon.command';

type AnnulerAbandonUseCaseData = AnnulerAbandonCommand['data'];

export type AnnulerAbandonUseCase = Message<'ANNULER_ABANDON_USECASE', AnnulerAbandonUseCaseData>;

export const registerAnnulerAbandonUseCase = () => {
  const runner: MessageHandler<AnnulerAbandonUseCase> = async (data) => {
    await mediator.send<AnnulerAbandonCommand>({
      type: 'ANNULER_ABANDON_COMMAND',
      data,
    });
  };
  mediator.register('ANNULER_ABANDON_USECASE', runner);
};
