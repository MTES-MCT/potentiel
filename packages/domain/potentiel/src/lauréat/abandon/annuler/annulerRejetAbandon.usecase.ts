import { Message, MessageHandler, mediator } from 'mediateur';
import { AnnulerAbandonCommand } from './annulerAbandon.command';
import { AbandonCommand } from '../abandon.command';
import { DemanderAbandonCommand } from '../demander/demanderAbandon.command';

type AnnulerRejetAbandonUseCaseData = AnnulerAbandonCommand['data'] &
  DemanderAbandonCommand['data'];

export type AnnulerRejetAbandonUseCase = Message<
  'ANNULER_REJET_ABANDON_USECASE',
  AnnulerRejetAbandonUseCaseData
>;

export const registerAnnulerRejetAbandonUseCase = () => {
  const runner: MessageHandler<AnnulerRejetAbandonUseCase> = async (data) => {
    await mediator.send<AbandonCommand>({
      type: 'ANNULER_ABANDON_COMMAND',
      data,
    });

    await mediator.send<DemanderAbandonCommand>({
      type: 'DEMANDER_ABANDON_COMMAND',
      data,
    });
  };
  mediator.register('ANNULER_REJET_ABANDON_USECASE', runner);
};
