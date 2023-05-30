import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { buildConsulterGestionnaireRéseauQuery } from '../../gestionnaireRéseau';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
  buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
} from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';

import {
  TransmettreDemandeComplèteRaccordementCommand,
  buildTransmettreDemandeComplèteRaccordementCommand,
} from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { buildConsulterProjetQuery } from '../../projet/consulter/consulterProjet.query';

type TransmettreDemandeComplèteRaccordementUseCase = Message<
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  TransmettreDemandeComplèteRaccordementCommand['data'] &
    Pick<
      EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand['data'],
      'nouvelAccuséRéception'
    >
>;

export const registerTransmettreDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<TransmettreDemandeComplèteRaccordementUseCase> = async ({
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossierRaccordement,
    nouvelAccuséRéception: { format, content },
  }) => {
    const gestionnaireRéseau = await mediator.send(
      buildConsulterGestionnaireRéseauQuery({
        identifiantGestionnaireRéseau,
      }),
    );

    const { identifiantGestionnaire } = await mediator.send(
      buildConsulterProjetQuery({ identifiantProjet }),
    );

    await mediator.send(
      buildTransmettreDemandeComplèteRaccordementCommand({
        identifiantProjet,
        identifiantGestionnaireRéseau: { codeEIC: gestionnaireRéseau.codeEIC },
        identifiantGestionnaireRéseauProjet: identifiantGestionnaire,
        dateQualification,
        référenceDossierRaccordement,
      }),
    );

    await mediator.send(
      buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand({
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement: référenceDossierRaccordement,
        nouvelAccuséRéception: {
          format,
          content,
        },
      }),
    );
  };
  mediator.register('TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};

export const buildTransmettreDemandeComplèteRaccordementUseCase =
  getMessageBuilder<TransmettreDemandeComplèteRaccordementUseCase>(
    'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  );
