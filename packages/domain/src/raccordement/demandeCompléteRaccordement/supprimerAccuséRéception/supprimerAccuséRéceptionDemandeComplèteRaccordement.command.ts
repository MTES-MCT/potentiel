import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { isNone } from '@potentiel/monads';
import { AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent } from './accuséRéceptionDemandeComplèteRaccordementSupprimé.event';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

const SUPPRIMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND = Symbol(
  'SUPPRIMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
);

export type SupprimerAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  typeof SUPPRIMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
    accuséRéception: { format: string };
  }
>;

export type SupprimerAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

export const registerSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand = ({
  loadAggregate,
  publish,
}: SupprimerAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<
    SupprimerAccuséRéceptionDemandeComplèteRaccordementCommand
  > = async ({ identifiantProjet, référence, accuséRéception: { format } }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référence)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const accuséRéceptionSupprimeEvent: AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementSupprimé',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référence: référence,
        format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), accuséRéceptionSupprimeEvent);
  };

  mediator.register(SUPPRIMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND, handler);
};

export const buildSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand =
  getMessageBuilder<SupprimerAccuséRéceptionDemandeComplèteRaccordementCommand>(
    SUPPRIMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND,
  );
