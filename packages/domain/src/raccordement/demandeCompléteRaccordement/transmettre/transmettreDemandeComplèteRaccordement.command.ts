import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import { Publish } from '@potentiel/core-domain';
import { DemandeComplèteRaccordementTransmiseEvent } from './demandeComplèteRaccordementTransmise.event';
import { createRaccordementAggregateId } from '../../raccordement.aggregate';
import { PlusieursGestionnairesRéseauPourUnProjetError } from '../../raccordement.errors';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../../../gestionnaireRéseau/identifiantGestionnaireRéseau';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
    identifiantGestionnaireRéseauProjet?: IdentifiantGestionnaireRéseau;
    identifiantProjet: IdentifiantProjet;
    dateQualification?: Date;
    référenceDossierRaccordement: string;
  }
>;

export type TransmettreDemandeComplèteRaccordementDependencies = {
  publish: Publish;
};

export const registerTransmettreDemandeComplèteRaccordementCommand = ({
  publish,
}: TransmettreDemandeComplèteRaccordementDependencies) => {
  const handler: MessageHandler<TransmettreDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireRéseau,
    référenceDossierRaccordement,
    identifiantGestionnaireRéseauProjet,
  }) => {
    if (
      identifiantGestionnaireRéseauProjet &&
      identifiantGestionnaireRéseau.codeEIC !== identifiantGestionnaireRéseauProjet.codeEIC
    ) {
      throw new PlusieursGestionnairesRéseauPourUnProjetError();
    }

    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification?.toISOString(),
        identifiantGestionnaireRéseau: formatIdentifiantGestionnaireRéseau(
          identifiantGestionnaireRéseau,
        ),
        référenceDossierRaccordement,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };

  mediator.register('TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};

export const buildTransmettreDemandeComplèteRaccordementCommand =
  getMessageBuilder<TransmettreDemandeComplèteRaccordementCommand>(
    'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  );
