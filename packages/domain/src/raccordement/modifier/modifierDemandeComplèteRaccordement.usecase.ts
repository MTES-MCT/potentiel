import { mediator, MessageHandler, Message } from 'mediateur';
import { ModifierDemandeComplèteRaccordementCommand } from './modifierDemandeComplèteRaccordement.command';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand } from '../enregistrer/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import { RaccordementCommand } from '../raccordement.command';

type ModifierDemandeComplèteRaccordementUseCaseData =
  ModifierDemandeComplèteRaccordementCommand['data'] &
    Pick<EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand['data'], 'accuséRéception'>;

export type ModifierDemandeComplèteRaccordementUseCase = Message<
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  ModifierDemandeComplèteRaccordementUseCaseData
>;

export const registerModifierDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierDemandeComplèteRaccordementUseCase> = async ({
    identifiantProjet,
    dateQualification,
    référenceDossierRaccordementActuelle: ancienneRéférenceDossierRaccordement,
    nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement,
    accuséRéception,
  }) => {
    await mediator.send<RaccordementCommand>({
      type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
      data: {
        identifiantProjet,
        dateQualification,
        référenceDossierRaccordementActuelle: ancienneRéférenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement,
      },
    });

    await mediator.send<RaccordementCommand>({
      type: 'ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
      data: {
        identifiantProjet,
        accuséRéception,
        référenceDossierRaccordement: nouvelleRéférenceDossierRaccordement,
      },
    });
  };

  mediator.register('MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};
