import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '../../projet/projet.valueType';
import { RaccordementCommand } from '../raccordement.command';

export type TransmettreDateMiseEnServiceUseCase = Message<
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
