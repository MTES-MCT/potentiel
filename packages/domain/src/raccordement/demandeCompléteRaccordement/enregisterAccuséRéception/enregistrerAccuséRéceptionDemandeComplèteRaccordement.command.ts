import { Readable } from 'stream';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish } from '@potentiel/core-domain';
import { createRaccordementAggregateId } from '../../raccordement.aggregate';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from './accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  'ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    nouvelleRéférenceDossierRaccordement: string;
    nouvelAccuséRéception: { format: string; content: Readable };
  }
>;

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  opération: 'création';
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  nouveauFichier: {
    format: string;
    content: Readable;
  };
}) => Promise<void>;

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
    nouvelleRéférenceDossierRaccordement,
    nouvelAccuséRéception,
  }) => {
    await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
      opération: 'création',
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      référenceDossierRaccordement: nouvelleRéférenceDossierRaccordement,
      nouveauFichier: nouvelAccuséRéception,
    });

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
