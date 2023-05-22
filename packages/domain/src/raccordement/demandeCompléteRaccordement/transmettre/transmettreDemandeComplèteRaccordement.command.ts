import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { DemandeComplèteRaccordementTransmiseEvent } from './demandeComplèteRaccordementTransmise.event';
import { isSome } from '@potentiel/monads';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '../enregisterAccuséRéception/accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../../raccordement.aggregate';
import { PlusieursGestionnairesRéseauPourUnProjetError } from '../../raccordement.errors';
import {
  IdentifiantGestionnaireRéseau,
  formatIdentifiantGestionnaireRéseau,
} from '../../../gestionnaireRéseau/identifiantGestionnaireRéseau';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

const TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND = Symbol(
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
);

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  typeof TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND,
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
    identifiantProjet: IdentifiantProjet;
    dateQualification?: Date;
    référence: string;
    accuséRéception: { format: string };
  }
>;

export type TransmettreDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerTransmettreDemandeComplèteRaccordementCommand = ({
  publish,
  loadAggregate,
}: TransmettreDemandeComplèteRaccordementDependencies) => {
  const handler: MessageHandler<TransmettreDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireRéseau,
    référence,
    accuséRéception,
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (
      isSome(raccordement) &&
      raccordement.gestionnaireRéseau.codeEIC !== identifiantGestionnaireRéseau.codeEIC
    ) {
      throw new PlusieursGestionnairesRéseauPourUnProjetError();
    }

    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification?.toISOString(),
        identifiantGestionnaireRéseau: formatIdentifiantGestionnaireRéseau(
          identifiantGestionnaireRéseau,
        ),
        référenceDossierRaccordement: référence,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);

    const accuséRéceptionTransmisEvent: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référence: référence,
        format: accuséRéception.format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), accuséRéceptionTransmisEvent);
  };

  mediator.register(TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND, handler);
};

export const buildTransmettreDemandeComplèteRaccordementCommand =
  getMessageBuilder<TransmettreDemandeComplèteRaccordementCommand>(
    TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND,
  );
