import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { buildConsulterGestionnaireRéseauQuery } from '../../gestionnaireRéseau';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordement } from './enregistrerAccuséRéceptionDemandeComplèteRaccordement';
import { Readable } from 'stream';
import {
  TransmettreDemandeComplèteRaccordementCommand,
  buildTransmettreDemandeComplèteRaccordementCommand,
} from './transmettreDemandeComplèteRaccordement.command';

const TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE = Symbol(
  'MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE',
);

type TransmettreDemandeComplèteRaccordementDependencies = {
  enregistrerAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordement;
};

type TransmettreDemandeComplèteRaccordementUseCaseData =
  TransmettreDemandeComplèteRaccordementCommand['data'] & {
    accuséRéception: {
      content: Readable;
    };
  };

type TransmettreDemandeComplèteRaccordementUseCase = Message<
  typeof TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE,
  TransmettreDemandeComplèteRaccordementUseCaseData
>;

export const registerTransmettreDemandeComplèteRaccordementUseCase = ({
  enregistrerAccuséRéceptionDemandeComplèteRaccordement,
}: TransmettreDemandeComplèteRaccordementDependencies) => {
  const runner: MessageHandler<TransmettreDemandeComplèteRaccordementUseCase> = async ({
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossierRaccordement,
    accuséRéception: { format, content },
  }) => {
    const gestionnaireRéseau = await mediator.send(
      buildConsulterGestionnaireRéseauQuery({
        codeEIC: identifiantGestionnaireRéseau.codeEIC,
      }),
    );

    await mediator.send(
      buildTransmettreDemandeComplèteRaccordementCommand({
        identifiantProjet,
        identifiantGestionnaireRéseau: { codeEIC: gestionnaireRéseau.codeEIC },
        dateQualification,
        référenceDossierRaccordement,
        accuséRéception: {
          format,
        },
      }),
    );

    await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet,
      référenceDossierRaccordement,
      format,
      content,
    });
  };
  mediator.register(TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE, runner);
};

export const buildTransmettreDemandeComplèteRaccordementUseCase = getMessageBuilder(
  TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE,
);
