import { mediator, MessageHandler, Message, getMessageBuilder } from 'mediateur';
import {
  ModifierDemandeComplèteRaccordementCommand,
  buildModifierDemandeComplèteRaccordementCommand,
} from './modifier/modifierDemandeComplèteRaccordement.command';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
  buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
} from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';

import { buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery } from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';

type ModifierDemandeComplèteRaccordementUseCase = Message<
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  ModifierDemandeComplèteRaccordementCommand['data'] &
    Pick<
      EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand['data'],
      'nouvelAccuséRéception'
    >
>;

export const registerModifierDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierDemandeComplèteRaccordementUseCase> = async ({
    identifiantProjet,
    dateQualification,
    ancienneRéférence,
    nouvelleRéférence,
    nouvelAccuséRéception,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({ identifiantProjet, référence: ancienneRéférence }),
    );

    const ancienAccuséRéception = await mediator.send(
      buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery({
        référenceDossierRaccordement: ancienneRéférence,
        identifiantProjet,
        format: dossierRaccordement.accuséRéception?.format || '',
      }),
    );

    await mediator.send(
      buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand({
        identifiantProjet,
        ancienneRéférence,
        nouvelleRéférence,
        ancienAccuséRéception,
        nouvelAccuséRéception,
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
  };

  mediator.register('MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};

export const buildModifierDemandeComplèteRaccordementUseCase =
  getMessageBuilder<ModifierDemandeComplèteRaccordementUseCase>(
    'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  );
