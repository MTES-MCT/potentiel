import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { RaccordementCommand } from '../raccordement.command';
import { TransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement.command';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand } from '../enregistrer/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';

export type TransmettreDemandeComplèteRaccordementUseCase = Message<
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
    await mediator.send<RaccordementCommand>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
      data: {
        identifiantProjet,
        identifiantGestionnaireRéseau,
        dateQualification,
        référenceDossierRaccordement,
      },
    });

    await mediator.send<RaccordementCommand>({
      type: 'ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
      data: {
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement: référenceDossierRaccordement,
        nouvelAccuséRéception: {
          format,
          content,
        },
      },
    });
  };

  mediator.register('TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};

export const buildTransmettreDemandeComplèteRaccordementUseCase =
  getMessageBuilder<TransmettreDemandeComplèteRaccordementUseCase>(
    'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  );
