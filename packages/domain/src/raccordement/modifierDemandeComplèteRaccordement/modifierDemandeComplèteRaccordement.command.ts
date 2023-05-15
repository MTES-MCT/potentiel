import { Publish, LoadAggregate, CommandHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../raccordement.aggregate';
import { DemandeComplèteRaccordementModifiéeEvent } from './DemandeComplèteRaccordementModifiée.event';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { Readable } from 'stream';
import { RemplacerAccuséRéceptionDemandeComplèteRaccordement } from './remplacerAccuséRéceptionDemandeComplèteRaccordement';

type ModifierDemandeComplèteRaccordementCommand = {
  identifiantProjet: IdentifiantProjet;
  dateQualification: Date;
  ancienneRéférence: string;
  nouvelleRéférence: string;
  nouveauFichier: {
    format: string;
    content: Readable;
  };
};

type ModifierDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  remplacerAccuséRéceptionDemandeComplèteRaccordement: RemplacerAccuséRéceptionDemandeComplèteRaccordement;
};

export const modifierDemandeComplèteRaccordementCommandHandlerFactory: CommandHandlerFactory<
  ModifierDemandeComplèteRaccordementCommand,
  ModifierDemandeComplèteRaccordementDependencies
> =
  ({ publish, loadAggregate, remplacerAccuséRéceptionDemandeComplèteRaccordement }) =>
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

    const event: DemandeComplèteRaccordementModifiéeEvent = {
      type: 'DemandeComplèteRaccordementModifiée',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification.toISOString(),
        ancienneRéférence,
        nouvelleRéférence,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);

    await remplacerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet,
      ancienneRéférence,
      nouvelleRéférence,
      nouveauFichier,
    });
  };
