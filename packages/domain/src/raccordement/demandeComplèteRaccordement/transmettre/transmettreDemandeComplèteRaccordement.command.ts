import { CommandHandlerFactory, LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../../../gestionnaireRéseau';
import { DemandeComplèteRaccordementTransmiseEvent } from './demandeComplèteRaccordementTransmise.event';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet';

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

    const raccordement = await loadRaccordementAggregate(
      `raccordement#${formatIdentifiantProjet(identifiantProjet)}`,
    );

    if (raccordement.gestionnaireRéseau.codeEIC !== identifiantGestionnaireRéseau.codeEIC) {
      throw new Error(
        'Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau',
      );
    }

    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification.toISOString(),
        identifiantGestionnaireRéseau: formatIdentifiantGestionnaireRéseau(
          identifiantGestionnaireRéseau,
        ),
        référenceDemandeRaccordement,
      },
    };

    await publish(`raccordement#${formatIdentifiantProjet(identifiantProjet)}`, event);
  };
