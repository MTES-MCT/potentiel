import { Message, MessageHandler, mediator } from 'mediateur';
import { TransmettreDateMiseEnServiceCommand } from './transmettreDateMiseEnService.command';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

export type TransmettreDateMiseEnServiceUseCase = Message<
  'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
  {
    dateMiseEnServiceValue: string;
    référenceDossierValue: string;
    identifiantProjetValue: string;
    dateDésignationValue: string;
  }
>;

export const registerTransmettreDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<TransmettreDateMiseEnServiceUseCase> = async ({
    dateMiseEnServiceValue,
    référenceDossierValue,
    identifiantProjetValue,
    dateDésignationValue,
  }) => {
    const dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnServiceValue);
    const dateDésignation = DateTime.convertirEnValueType(dateDésignationValue);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossier =
      RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue);

    await mediator.send<TransmettreDateMiseEnServiceCommand>({
      type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND',
      data: {
        dateMiseEnService,
        identifiantProjet,
        référenceDossier,
        dateDésignation,
      },
    });
  };

  mediator.register('TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE', runner);
};
