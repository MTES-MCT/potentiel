import { CommandHandlerFactory, Publish } from '@potentiel/core-domain';
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
};

export const transmettreDemandeComplèteRaccordementCommandHandlerFactory: CommandHandlerFactory<
  TransmettreDemandeComplèteRaccordementCommand,
  TransmettreDemandeComplèteRaccordementDependencies
> =
  ({ publish }) =>
  async ({
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireRéseau,
    référenceDemandeRaccordement,
  }) => {
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

    await publish(`demande-complète-raccordement#${référenceDemandeRaccordement}`, event);
  };
