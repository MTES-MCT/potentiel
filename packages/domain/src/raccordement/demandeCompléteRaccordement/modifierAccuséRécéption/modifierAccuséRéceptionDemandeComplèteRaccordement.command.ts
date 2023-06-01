import { Readable } from 'stream';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '../enregisterAccuséRéception/accuséRéceptionDemandeComplèteRaccordementTransmis.event';

export type ModifierAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  'MODIFIER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    ancienneRéférenceDossierRaccordement: string;
    ancienAccuséRéception: { format: string; content: Readable };
    nouvelleRéférenceDossierRaccordement: string;
    nouvelAccuséRéception: { format: string; content: Readable };
  }
>;

export type ModifierAccuséRéceptionDemandeComplèteRaccordementPort = (
  args:
    | {
        opération: 'modification';
        identifiantProjet: string;
        ancienneRéférenceDossierRaccordement: string;
        ancienFichier: { format: string; content: Readable };
        nouveauFichier: { format: string; content: Readable };
      }
    | {
        opération: 'déplacement-fichier';
        identifiantProjet: string;
        ancienneRéférenceDossierRaccordement: string;
        ancienFichier: { format: string; content: Readable };
        nouvelleRéférenceDossierRaccordement: string;
        nouveauFichier: { format: string; content: Readable };
      },
) => Promise<void>;

export type ModifierAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerAccuséRéceptionDemandeComplèteRaccordement: ModifierAccuséRéceptionDemandeComplèteRaccordementPort;
};

export const registerModifierAccuséRéceptionDemandeComplèteRaccordementCommand = ({
  publish,
  loadAggregate,
  enregistrerAccuséRéceptionDemandeComplèteRaccordement,
}: ModifierAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<
    ModifierAccuséRéceptionDemandeComplèteRaccordementCommand
  > = async ({
    identifiantProjet,
    ancienneRéférenceDossierRaccordement,
    nouvelleRéférenceDossierRaccordement,
    nouvelAccuséRéception,
    ancienAccuséRéception,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);
    if (
      isNone(raccordement) ||
      !raccordement.références.includes(nouvelleRéférenceDossierRaccordement)
    ) {
      throw new DossierRaccordementNonRéférencéError();
    }

    if (ancienneRéférenceDossierRaccordement !== nouvelleRéférenceDossierRaccordement) {
      await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
        opération: 'déplacement-fichier',
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        ancienneRéférenceDossierRaccordement,
        ancienFichier: ancienAccuséRéception,
        nouvelleRéférenceDossierRaccordement,
        nouveauFichier: nouvelAccuséRéception,
      });
    } else {
      await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
        opération: 'modification',
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        ancienneRéférenceDossierRaccordement,
        ancienFichier: ancienAccuséRéception,
        nouveauFichier: nouvelAccuséRéception,
      });
    }

    const accuséRéceptionTransmisEvent: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement: nouvelleRéférenceDossierRaccordement,
        format: nouvelAccuséRéception.format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), accuséRéceptionTransmisEvent);
  };

  mediator.register('MODIFIER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};

export const buildModifierAccuséRéceptionDemandeComplèteRaccordementCommand =
  getMessageBuilder<ModifierAccuséRéceptionDemandeComplèteRaccordementCommand>(
    'MODIFIER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  );
