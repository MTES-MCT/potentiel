import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
  buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
} from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';

import {
  TransmettreDemandeComplèteRaccordementCommand,
  buildTransmettreDemandeComplèteRaccordementCommand,
} from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { buildConsulterGestionnaireRéseauQuery } from '../../gestionnaireRéseau/query/consulter/consulterGestionnaireRéseau.query';

type TransmettreDemandeComplèteRaccordementUseCase = Message<
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  TransmettreDemandeComplèteRaccordementCommand['data'] &
    EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand['data']
>;

export const registerTransmettreDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<TransmettreDemandeComplèteRaccordementUseCase> = async ({
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossierRaccordement,
    accuséRéception: { format, content },
  }) => {
    const gestionnaireRéseau = await mediator.send(
      buildConsulterGestionnaireRéseauQuery({
        identifiantGestionnaireRéseau,
      }),
    );

    await mediator.send(
      buildTransmettreDemandeComplèteRaccordementCommand({
        identifiantProjet,
        identifiantGestionnaireRéseau: { codeEIC: gestionnaireRéseau.codeEIC },
        dateQualification,
        référenceDossierRaccordement,
      }),
    );

    await mediator.send(
      buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand({
        identifiantProjet,
        référenceDossierRaccordement,
        accuséRéception: {
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
