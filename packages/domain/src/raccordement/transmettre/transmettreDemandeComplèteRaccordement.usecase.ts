import { Message, MessageHandler, mediator } from 'mediateur';
import { RaccordementCommand } from '../raccordement.command';
import { TransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement.command';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand } from '../enregistrer/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';

export type TransmettreDemandeComplèteRaccordementUseCase = Message<
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  TransmettreDemandeComplèteRaccordementCommand['data'] &
    Pick<EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand['data'], 'accuséRéception'>
>;

export const registerTransmettreDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<TransmettreDemandeComplèteRaccordementUseCase> = async ({
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossierRaccordement,
    accuséRéception: { format, content },
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
        référenceDossierRaccordement,
        accuséRéception: {
          format,
          content,
        },
      },
    });
  };

  mediator.register('TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};
