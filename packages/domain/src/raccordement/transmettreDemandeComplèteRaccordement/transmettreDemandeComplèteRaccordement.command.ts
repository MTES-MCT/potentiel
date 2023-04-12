import { CommandHandlerFactory, LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../../gestionnaireRéseau';
import { DemandeComplèteRaccordementTransmiseEvent } from './demandeComplèteRaccordementTransmise.event';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { isSome } from '@potentiel/monads';
import { PlusieursGestionnairesRéseauPourUnProjetError } from './plusieursGestionnairesRéseauPourUnProjet.error';

export type TransmettreDemandeComplèteRaccordementCommand = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
  identifiantProjet: IdentifiantProjet;
  dateQualification: Date;
  référenceDemandeRaccordement: string;
};

export type TransmettreDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const transmettreDemandeComplèteRaccordementCommandHandlerFactory: CommandHandlerFactory<
  TransmettreDemandeComplèteRaccordementCommand,
  TransmettreDemandeComplèteRaccordementDependencies
> =
  ({ publish, loadAggregate }) =>
  async ({
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireRéseau,
    référenceDemandeRaccordement,
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (
      isSome(raccordement) &&
      raccordement.gestionnaireRéseau.codeEIC !== identifiantGestionnaireRéseau.codeEIC
    ) {
      throw new PlusieursGestionnairesRéseauPourUnProjetError();
    }

    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification.toISOString(),
        identifiantGestionnaireRéseau: formatIdentifiantGestionnaireRéseau(
          identifiantGestionnaireRéseau,
        ),
        référenceDossierRaccordement: référenceDemandeRaccordement,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };
