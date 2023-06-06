import { mediator, MessageHandler, Message, getMessageBuilder } from 'mediateur';
import {
  ModifierDemandeComplèteRaccordementCommand,
  buildModifierDemandeComplèteRaccordementCommand,
} from './modifier/modifierDemandeComplèteRaccordement.command';
import { buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand } from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';

import { buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery } from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';
import {
  ModifierAccuséRéceptionDemandeComplèteRaccordementCommand,
  buildModifierAccuséRéceptionDemandeComplèteRaccordementCommand,
} from "./modifierAccuséRéceptionDemandeComplèteRaccordement.command";

export type ModifierDemandeComplèteRaccordementUseCase = Message<
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  ModifierDemandeComplèteRaccordementCommand['data'] &
    Pick<ModifierAccuséRéceptionDemandeComplèteRaccordementCommand['data'], 'nouvelAccuséRéception'>
>;

export const registerModifierDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierDemandeComplèteRaccordementUseCase> = async ({
    identifiantProjet,
    dateQualification,
    ancienneRéférenceDossierRaccordement,
    nouvelleRéférenceDossierRaccordement,
    nouvelAccuséRéception,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        identifiantProjet,
        référence: ancienneRéférenceDossierRaccordement,
      }),
    );

    await mediator.send(
      buildModifierDemandeComplèteRaccordementCommand({
        identifiantProjet,
        dateQualification,
        ancienneRéférenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement,
      }),
    );

    const ancienAccuséRéception = await mediator.send(
      buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery({
        référenceDossierRaccordement: ancienneRéférenceDossierRaccordement,
        identifiantProjet,
        format: dossierRaccordement.accuséRéception?.format || '',
      }),
    );

    if (!ancienAccuséRéception) {
      await mediator.send(
        buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand({
          identifiantProjet,
          nouvelleRéférenceDossierRaccordement,
          nouvelAccuséRéception,
        }),
      );
      return;
    }

    await mediator.send(
      buildModifierAccuséRéceptionDemandeComplèteRaccordementCommand({
        identifiantProjet,
        ancienneRéférenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement,
        ancienAccuséRéception,
        nouvelAccuséRéception,
      }),
    );
  };

  mediator.register('MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};

export const buildModifierDemandeComplèteRaccordementUseCase =
  getMessageBuilder<ModifierDemandeComplèteRaccordementUseCase>(
    'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  );
