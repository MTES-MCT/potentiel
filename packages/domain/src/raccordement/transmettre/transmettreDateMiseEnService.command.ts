import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '../../projet/projet.valueType';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { DateMiseEnServiceTransmiseEvent } from '../raccordement.event';
import { RéférenceDossierRaccordement } from '../raccordement.valueType';

export type TransmettreDateMiseEnServiceCommandDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

export type TransmettreDateMiseEnServiceCommand = Message<
  'TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND',
  {
    dateMiseEnService: Date;
    référenceDossierRaccordement: RéférenceDossierRaccordement;
    identifiantProjet: IdentifiantProjet;
  }
>;

export const registerTransmettreDateMiseEnServiceCommand = ({
  loadAggregate,
  publish,
}: TransmettreDateMiseEnServiceCommandDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<TransmettreDateMiseEnServiceCommand> = async ({
    dateMiseEnService,
    référenceDossierRaccordement,
    identifiantProjet,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const dateMiseEnServiceTransmise: DateMiseEnServiceTransmiseEvent = {
      type: 'DateMiseEnServiceTransmise',
      payload: {
        dateMiseEnService: dateMiseEnService.toISOString(),
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), dateMiseEnServiceTransmise);
  };

  mediator.register('TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND', handler);
};
