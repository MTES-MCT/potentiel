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

    if (gestionnaireRéseau.expressionReguliere) {
      const isRefValid = new RegExp(gestionnaireRéseau.expressionReguliere).test(
        référenceDossierRaccordement,
      );
      if (!isRefValid) {
        throw new Error('Format non valide de la référence du dossier de raccordement');
      }
    }

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
