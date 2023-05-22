import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet } from '../../projet/identifiantProjet';

const TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE = Symbol('TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE');

type TransmettreDateMiseEnServiceUseCase = Message<
  typeof TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE,
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
      buildTransmettreDateMiseEnServiceUseCase({
        dateMiseEnService,
        identifiantProjet,
        référenceDossierRaccordement,
      }),
    );
  };

  mediator.register(TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE, runner);
};

export const buildTransmettreDateMiseEnServiceUseCase =
  getMessageBuilder<TransmettreDateMiseEnServiceUseCase>(TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE);
