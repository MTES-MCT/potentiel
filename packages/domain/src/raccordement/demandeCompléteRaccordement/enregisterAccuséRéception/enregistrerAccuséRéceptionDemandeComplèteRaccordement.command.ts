import { Readable } from 'stream';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
} from '../../raccordement.aggregate';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from './accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

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
        operation: 'creation';
        identifiantProjet: string;
        référenceDossierRaccordement: string;
        accuséRéception: {
          format: string;
          content: Readable;
        };
      }
    | {
        operation: 'modification';
        ancienneRéférenceDossierRaccordement: string;
        nouvelleRéférenceDossierRaccordement: string;
        ancienAccuséRéception: { format: string; content: Readable };
        nouvelAccuséRéception: { format: string; content: Readable };
      },
) => Promise<void>;

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  enregistrerAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export const registerEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand = ({
  publish,
  enregistrerAccuséRéceptionDemandeComplèteRaccordement,
}: EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
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
      await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
        operation: 'modification',
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        ancienneRéférenceDossierRaccordement,
        ancienAccuséRéception,
        nouvelAccuséRéception,
        nouvelleRéférenceDossierRaccordement,
      });
    } else {
      await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
        operation: 'creation',
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement,
        accuséRéception: nouvelAccuséRéception,
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
