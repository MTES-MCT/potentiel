import { Message, MessageHandler, mediator } from 'mediateur';
import { RejeterAbandonCommand } from './rejeterAbandon.command';
import { AbandonCommand } from '../abandon.command';

type RejeterAbandonUseCaseData = RejeterAbandonCommand['data'];

export type RejeterAbandonUseCase = Message<'REJETER_ABANDON_USECASE', RejeterAbandonUseCaseData>;

export const registerRejeterAbandonUseCase = () => {
  const runner: MessageHandler<RejeterAbandonUseCase> = async ({
    identifiantProjet,
    rejetéLe,
    réponseSignée,
  }) => {
    await mediator.send<AbandonCommand>({
      type: 'REJETER_ABANDON_COMMAND',
      data: {
        identifiantProjet,
        rejetéLe,
        réponseSignée,
      },
    });
  };
  mediator.register('REJETER_ABANDON_USECASE', runner);
};
