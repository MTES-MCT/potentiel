import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet } from '../../projet/identifiantProjet';
import { buildTransmettreDateMiseEnServiceCommand } from './transmettre/transmettreDateMiseEnService.command';
import { buildRechercherDossierRaccordementQuery } from '../dossierRaccordement/rechercher/rechercherDossierRaccordement.query';
import {
  AucunDossierCorrespondantError,
  PlusieursDossiersCorrespondantsError,
} from '../raccordement.errors';

type TransmettreDateMiseEnServiceUseCase = Message<
  'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
  {
    dateMiseEnService: Date;
    référenceDossierRaccordement: string;
    identifiantProjet?: IdentifiantProjet;
  }
>;

export const registerTransmettreDateMiseEnServiceUseCase = () => {
  const runner: MessageHandler<TransmettreDateMiseEnServiceUseCase> = async ({
    dateMiseEnService,
    référenceDossierRaccordement,
    identifiantProjet,
  }) => {
    if (identifiantProjet) {
      await mediator.send(
        buildTransmettreDateMiseEnServiceCommand({
          dateMiseEnService,
          identifiantProjet,
          référenceDossierRaccordement,
        }),
      );
      return;
    }

    const dossiers = await mediator.send(
      buildRechercherDossierRaccordementQuery({
        référence: référenceDossierRaccordement,
      }),
    );

    if (dossiers.length === 0) {
      throw new AucunDossierCorrespondantError();
    }
    if (dossiers.length > 1) {
      throw new PlusieursDossiersCorrespondantsError(dossiers.map((d) => d.identifiantProjet));
    }

    await mediator.send(
      buildTransmettreDateMiseEnServiceCommand({
        identifiantProjet: dossiers[0].identifiantProjet,
        référenceDossierRaccordement,
        dateMiseEnService: dateMiseEnService,
      }),
    );
  };

  mediator.register('TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE', runner);
};

export const buildTransmettreDateMiseEnServiceUseCase =
  getMessageBuilder<TransmettreDateMiseEnServiceUseCase>(
    'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
  );
