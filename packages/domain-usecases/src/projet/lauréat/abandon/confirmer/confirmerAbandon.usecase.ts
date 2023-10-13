import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonCommand } from '../abandon.command';
import { ConfirmerAbandonCommand } from './confirmerAbandon.command';

type ConfirmerAbandonUseCaseData = ConfirmerAbandonCommand['data'];

export type ConfirmerAbandonUseCase = Message<
  'CONFIRMER_ABANDON_USECASE',
  ConfirmerAbandonUseCaseData
>;

export const registerConfirmerAbandonUseCase = () => {
  const runner: MessageHandler<ConfirmerAbandonUseCase> = async (data) => {
    await mediator.send<AbandonCommand>({
      type: 'CONFIRMER_ABANDON_COMMAND',
      data,
    });
  };
  mediator.register('CONFIRMER_ABANDON_USECASE', runner);
};
