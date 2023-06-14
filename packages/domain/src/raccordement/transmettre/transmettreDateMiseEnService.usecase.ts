import { Message, MessageHandler, mediator } from 'mediateur';
import { RaccordementCommand } from '../raccordement.command';
import { TransmettreDateMiseEnServiceCommand } from './transmettreDateMiseEnService.command';

type TransmettreDateMiseEnServiceUseCaseData = TransmettreDateMiseEnServiceCommand['data'];

export type TransmettreDateMiseEnServiceUseCase = Message<
  'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
  TransmettreDateMiseEnServiceUseCaseData
>;

export const registerTransmettreDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<TransmettreDateMiseEnServiceUseCase> = async ({
    dateMiseEnService,
    référenceDossierRaccordement,
    identifiantProjet,
  }) => {
    await mediator.send<RaccordementCommand>({
      type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND',
      data: {
        dateMiseEnService,
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });
  };

  mediator.register('TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE', runner);
};
