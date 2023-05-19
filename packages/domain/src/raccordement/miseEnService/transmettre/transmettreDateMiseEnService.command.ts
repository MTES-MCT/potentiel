import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { DateMiseEnServiceTransmiseEvent } from './dateMiseEnServiceTransmise.event';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';

const TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND = Symbol('TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND');

export type TransmettreDateMiseEnServiceCommandDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

type TransmettreDateMiseEnServiceCommand = Message<
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
  const handler: MessageHandler<TransmettreDateMiseEnServiceCommand> = async ({
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

export const buildTransmettreDateMiseEnServiceCommand =
  getMessageBuilder<TransmettreDateMiseEnServiceCommand>(TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND);
