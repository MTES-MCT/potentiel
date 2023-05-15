import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { DateMiseEnServiceTransmiseEvent } from './dateMiseEnServiceTransmise.event';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { Message, MessageHandler, mediator } from 'mediateur';

const TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND = Symbol('TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND');

type TransmettreDateMiseEnServiceCommandDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

type TransmettreDateMiseEnServiceCommandCommand = Message<
  typeof TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND,
  {
    dateMiseEnService: Date;
    référenceDossierRaccordement: string;
    identifiantProjet: IdentifiantProjet;
  }
>;

export const registerTransmettreDateMiseEnServiceCommand = ({
  loadAggregate,
  publish,
}: TransmettreDateMiseEnServiceCommandDependencies) => {
  const handler: MessageHandler<TransmettreDateMiseEnServiceCommandCommand> = async ({
    dateMiseEnService,
    référenceDossierRaccordement,
    identifiantProjet,
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const event: DateMiseEnServiceTransmiseEvent = {
      type: 'DateMiseEnServiceTransmise',
      payload: {
        dateMiseEnService: dateMiseEnService.toISOString(),
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };

  mediator.register(TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND, handler);
};

export const createTransmettreDateMiseEnServiceCommand = (
  commandData: TransmettreDateMiseEnServiceCommandCommand['data'],
): TransmettreDateMiseEnServiceCommandCommand => ({
  type: TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND,
  data: { ...commandData },
});
