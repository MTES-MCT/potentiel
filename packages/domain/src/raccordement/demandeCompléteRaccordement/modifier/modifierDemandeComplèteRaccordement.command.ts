import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../../raccordement.aggregate';
import { DemandeComplèteRaccordementModifiéeEvent } from './demandeComplèteRaccordementModifiée.event';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '../transmettre';

const MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND = Symbol(
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
);

type ModifierDemandeComplèteRaccordementCommand = Message<
  typeof MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND,
  {
    identifiantProjet: IdentifiantProjet;
    dateQualification: Date;
    ancienneRéférence: string;
    nouvelleRéférence: string;
    nouveauFichier: {
      format: string;
    };
  }
>;

type ModifierDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerModifierDemandeComplèteRaccordementCommand = ({
  publish,
  loadAggregate,
}: ModifierDemandeComplèteRaccordementDependencies) => {
  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    ancienneRéférence,
    nouvelleRéférence,
    nouveauFichier,
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(ancienneRéférence)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const demandeComplèteRaccordementModifiéeEvent: DemandeComplèteRaccordementModifiéeEvent = {
      type: 'DemandeComplèteRaccordementModifiée',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification.toISOString(),
        referenceActuelle: ancienneRéférence,
        nouvelleReference: nouvelleRéférence,
      },
    };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      demandeComplèteRaccordementModifiéeEvent,
    );

    const accuséRéceptionTransmisEvent: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement: nouvelleRéférence,
        format: nouveauFichier.format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), accuséRéceptionTransmisEvent);
  };

  mediator.register(MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND, handler);
};

export const buildModifierDemandeComplèteRaccordementCommand =
  getMessageBuilder<ModifierDemandeComplèteRaccordementCommand>(
    MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND,
  );
