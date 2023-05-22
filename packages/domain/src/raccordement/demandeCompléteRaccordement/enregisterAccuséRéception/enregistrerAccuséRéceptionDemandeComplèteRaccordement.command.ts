import { Readable } from 'stream';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from './accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

const ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND = Symbol(
  'ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
);

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  typeof ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
    accuséRéception: { format: string; content: Readable };
  }
>;

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  identifiantProjet: string;
  référence: string;
  format: string;
  content: Readable;
}) => Promise<void>;

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
  > = async ({ identifiantProjet, référence, accuséRéception: { format, content } }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référence)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      content,
      format,
      référence,
    });

    const accuséRéceptionTransmisEvent: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référence: référence,
        format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), accuséRéceptionTransmisEvent);
  };

  mediator.register(ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND, handler);
};

export const buildEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand =
  getMessageBuilder<EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand>(
    ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND,
  );
