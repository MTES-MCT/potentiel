import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet } from '../../projet/identifiantProjet';
import { buildTransmettreDateMiseEnServiceCommand } from './transmettre/transmettreDateMiseEnService.command';

type TransmettreDateMiseEnServiceUseCase = Message<
  'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
  {
    dateMiseEnService: Date;
    référenceDossierRaccordement: string;
    identifiantProjet: IdentifiantProjet;
  }
>;

export const registerTransmettreDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<TransmettreDateMiseEnServiceUseCase> = async ({
    dateMiseEnService,
    référenceDossierRaccordement,
    identifiantProjet,
  }) => {
    await mediator.send(
      buildTransmettreDateMiseEnServiceCommand({
        dateMiseEnService,
        identifiantProjet,
        référenceDossierRaccordement,
      }),
    );
  };

  mediator.register('TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE', runner);
};

export const buildTransmettreDateMiseEnServiceUseCase =
  getMessageBuilder<TransmettreDateMiseEnServiceUseCase>(
    'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
  );
