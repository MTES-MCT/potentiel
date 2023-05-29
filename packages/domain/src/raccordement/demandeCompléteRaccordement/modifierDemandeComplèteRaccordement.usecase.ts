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
import { buildRenommerAccuséRéceptionDemandeComplèteRaccordementCommand } from './renommerAccuséRéception/renommerAccuséRéceptionDemandeComplèteRaccordement.command';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';

import { buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery } from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';

import streamEqual from 'stream-equal';
import { buildMettreAJourAccuséRéceptionDemandeComplèteRaccordementCommand } from './mettreAJourAccuséRéception/mettreAJourAccuséRéceptionDemandeComplèteRaccordement.command';

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

    const existingFile = await mediator.send(
      buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery({
        référenceDossierRaccordement: ancienneRéférence,
        identifiantProjet,
        format: accuséRéception.format,
      }),
    );
    const référencesEgales = nouvelleRéférence === ancienneRéférence;
    const fichiersIdentique = await streamEqual(existingFile.content, accuséRéception.content);

    if (référencesEgales) {
      if (!fichiersIdentique) {
        await mediator.send(
          buildMettreAJourAccuséRéceptionDemandeComplèteRaccordementCommand({
            identifiantProjet,
            référenceDossierRaccordement: nouvelleRéférence,
            accuséRéception,
          }),
        );
      }
    }

    if (!référencesEgales) {
      if (fichiersIdentique) {
        await mediator.send(
          buildRenommerAccuséRéceptionDemandeComplèteRaccordementCommand({
            identifiantProjet,
            ancienneRéférenceDossierRaccordement: ancienneRéférence,
            nouvelleRéférenceDossierRaccordement: nouvelleRéférence,
            accuséRéception: {
              format: accuséRéception.format,
            },
          }),
        );
      } else {
        await mediator.send(
          buildSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand({
            identifiantProjet,
            référenceDossierRaccordement: ancienneRéférence,
            accuséRéception: {
              format: dossierRaccordement.accuséRéception?.format || '',
            },
          }),
        );
      }
    }

    await mediator.send(
      buildModifierDemandeComplèteRaccordementCommand({
        identifiantProjet,
        dateQualification,
        ancienneRéférence,
        nouvelleRéférence,
      }),
    );

    if (!référencesEgales && !fichiersIdentique)
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
