import { Readable } from 'stream';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from './accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  'ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    nouvelleRéférenceDossierRaccordement: string;
    nouvelAccuséRéception: { format: string; content: Readable };
    ancienneRéférenceDossierRaccordement?: string;
    ancienAccuséRéception?: { format: string; content: Readable };
  }
>;

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort = (
  args:
    | {
        opération: 'création';
        identifiantProjet: string;
        référenceDossierRaccordement: string;
        nouveauFichier: {
          format: string;
          content: Readable;
        };
      }
    | {
        opération: 'modification';
        identifiantProjet: string;
        ancienneRéférenceDossierRaccordement: string;
        nouvelleRéférenceDossierRaccordement: string;
        ancienFichier: { format: string; content: Readable };
        nouveauFichier: { format: string; content: Readable };
      },
) => Promise<void>;

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export const registerEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand = ({
  publish,
  loadAggregate,
  enregistrerAccuséRéceptionDemandeComplèteRaccordement,
}: EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<
    EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand
  > = async ({
    identifiantProjet,
    ancienneRéférenceDossierRaccordement,
    nouvelleRéférenceDossierRaccordement,
    ancienAccuséRéception,
    nouvelAccuséRéception,
  }) => {
    if (ancienAccuséRéception && ancienneRéférenceDossierRaccordement) {
      const raccordement = await loadRaccordementAggregate(identifiantProjet);

      if (
        isNone(raccordement) ||
        !raccordement.références.includes(ancienneRéférenceDossierRaccordement)
      ) {
        throw new DossierRaccordementNonRéférencéError();
      }
      await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
        opération: 'modification',
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        ancienneRéférenceDossierRaccordement,
        ancienFichier: ancienAccuséRéception,
        nouveauFichier: nouvelAccuséRéception,
        nouvelleRéférenceDossierRaccordement,
      });
    } else {
      await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
        opération: 'création',
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement: nouvelleRéférenceDossierRaccordement,
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

  mediator.register('ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};

export const buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand =
  getMessageBuilder<EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand>(
    'ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  );
