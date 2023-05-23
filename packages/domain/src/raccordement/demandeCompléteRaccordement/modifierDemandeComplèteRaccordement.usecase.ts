import { mediator, MessageHandler, Message, getMessageBuilder } from 'mediateur';
import {
  ModifierDemandeComplèteRaccordementCommand,
  buildModifierDemandeComplèteRaccordementCommand,
} from './modifier/modifierDemandeComplèteRaccordement.command';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
  buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
} from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import { buildSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand } from './supprimerAccuséRéception/supprimerAccuséRéceptionDemandeComplèteRaccordement.command';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';

type ModifierDemandeComplèteRaccordementUseCase = Message<
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  ModifierDemandeComplèteRaccordementCommand['data'] &
    Pick<EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand['data'], 'accuséRéception'>
>;

export const registerModifierDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierDemandeComplèteRaccordementUseCase> = async ({
    identifiantProjet,
    dateQualification,
    ancienneRéférence,
    nouvelleRéférence,
    accuséRéception,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        identifiantProjet,
        référence: ancienneRéférence,
      }),
    );

    await mediator.send(
      buildSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand({
        identifiantProjet,
        référenceDossierRaccordement: ancienneRéférence,
        accuséRéception: {
          format: dossierRaccordement.accuséRéception?.format || '',
        },
      }),
    );

    await mediator.send(
      buildModifierDemandeComplèteRaccordementCommand({
        identifiantProjet,
        dateQualification,
        ancienneRéférence,
        nouvelleRéférence,
      }),
    );

    await mediator.send(
      buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand({
        identifiantProjet,
        référenceDossierRaccordement: nouvelleRéférence,
        accuséRéception,
      }),
    );
  };

  mediator.register('MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};

export const buildModifierDemandeComplèteRaccordementUseCase =
  getMessageBuilder<ModifierDemandeComplèteRaccordementUseCase>(
    'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  );
