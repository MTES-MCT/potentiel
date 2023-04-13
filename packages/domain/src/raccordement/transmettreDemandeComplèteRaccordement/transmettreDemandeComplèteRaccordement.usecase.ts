import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  TransmettreDemandeComplèteRaccordementCommand,
  transmettreDemandeComplèteRaccordementCommandHandlerFactory,
} from './transmettreDemandeComplèteRaccordement.command';

type Dependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

export const transmettreDemandeComplèteRaccordementUseCaseFactory =
  ({ loadAggregate, publish }: Dependencies) =>
  async ({
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossierRaccordement,
  }: TransmettreDemandeComplèteRaccordementCommand) => {
    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
      });
    await transmettreDemandeComplèteRaccordement({
      identifiantProjet,
      identifiantGestionnaireRéseau,
      dateQualification,
      référenceDossierRaccordement,
    });
  };
