import { Publish, LoadAggregate, CommandHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../raccordement.aggregate';
import { DemandeComplèteRaccordementModifiéeEvent } from './DemandeComplèteRaccordementModifiée.event';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';

type ModifierDemandeComplèteRaccordementCommand = {
  identifiantProjet: IdentifiantProjet;
  dateQualification: Date;
  referenceActuelle: string;
  nouvelleReference: string;
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
  async ({ identifiantProjet, dateQualification, referenceActuelle, nouvelleReference }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(referenceActuelle)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const event: DemandeComplèteRaccordementModifiéeEvent = {
      type: 'DemandeComplèteRaccordementModifiée',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification.toISOString(),
        referenceActuelle,
        nouvelleReference,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };
