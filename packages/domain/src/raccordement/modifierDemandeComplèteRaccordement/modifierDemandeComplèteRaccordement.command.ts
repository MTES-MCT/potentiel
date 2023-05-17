import { Publish, LoadAggregate, CommandHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../raccordement.aggregate';
import { DemandeComplèteRaccordementModifiéeEvent } from './DemandeComplèteRaccordementModifiée.event';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '../transmettreDemandeComplèteRaccordement';

export type ModifierDemandeComplèteRaccordementCommand = {
  identifiantProjet: IdentifiantProjet;
  dateQualification: Date;
  ancienneRéférence: string;
  nouvelleRéférence: string;
  nouveauFichier: {
    format: string;
  };
};

type ModifierDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const modifierDemandeComplèteRaccordementCommandHandlerFactory: CommandHandlerFactory<
  ModifierDemandeComplèteRaccordementCommand,
  ModifierDemandeComplèteRaccordementDependencies
> =
  ({ publish, loadAggregate }) =>
  async ({
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
