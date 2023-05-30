import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet } from '../../projet/identifiantProjet';
import { buildTransmettreDateMiseEnServiceCommand } from './transmettre/transmettreDateMiseEnService.command';
import { buildRechercherDossierRaccordementQuery } from '../dossierRaccordement/rechercher/rechercherDossierRaccordement.query';
import { AucunDossierCorrespondantError } from '../raccordement.errors';

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

    for (const dossier of dossiers) {
      await mediator.send(
        buildTransmettreDateMiseEnServiceCommand({
          identifiantProjet: dossier.identifiantProjet,
          référenceDossierRaccordement,
          dateMiseEnService: dateMiseEnService,
        }),
      );
    }
  };

  mediator.register('TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE', runner);
};

export const buildTransmettreDateMiseEnServiceUseCase =
  getMessageBuilder<TransmettreDateMiseEnServiceUseCase>(
    'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
  );
