import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import {
  DateAntérieureDateDésignationProjetError,
  DateDansLeFuturError,
  DossierRaccordementNonRéférencéError,
} from '../raccordement.errors';
import { DateMiseEnServiceTransmiseEventV1 } from '../raccordement.event';
import { RéférenceDossierRaccordementValueType } from '../raccordement.valueType';
import { DateTimeValueType } from '../../common.valueType';

export type TransmettreDateMiseEnServiceCommandDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

export type TransmettreDateMiseEnServiceCommand = Message<
  'TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND',
  {
    dateMiseEnService: DateTimeValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType;
    identifiantProjet: IdentifiantProjetValueType;
    dateDésignation: DateTimeValueType;
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
    dateDésignation,
  }) => {
    if (dateMiseEnService.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    if (dateMiseEnService.date.getTime() < dateDésignation.date.getTime()) {
      throw new DateAntérieureDateDésignationProjetError();
    }

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const dateMiseEnServiceTransmise: DateMiseEnServiceTransmiseEventV1 = {
      type: 'DateMiseEnServiceTransmise-V1',
      payload: {
        dateMiseEnService: dateMiseEnService.formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), dateMiseEnServiceTransmise);
  };

  mediator.register('TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND', handler);
};
