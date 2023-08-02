import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';

import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '../../common.port';
import { Option, isNone, none } from '@potentiel/monads';
import {
  GarantiesFinancièresReadModel,
  GarantiesFinancièresReadModelKey,
} from '../garantiesFinancières.readModel';

export type ConsulterGarantiesFinancièresReadModel = GarantiesFinancièresReadModel;

export type ConsulterGarantiesFinancièresQuery = Message<
  'CONSULTER_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<ConsulterGarantiesFinancièresReadModel>
>;

export type ConsulterGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterGarantiesFinancièresQuery = ({
  find,
}: ConsulterGarantiesFinancièresDependencies) => {
  const queryHandler: MessageHandler<ConsulterGarantiesFinancièresQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: GarantiesFinancièresReadModelKey = `garanties-financières|${rawIdentifiantProjet}`;
    const result = await find<GarantiesFinancièresReadModel>(key);

    if (isNone(result)) {
      return none;
    }

    return result;
  };

  mediator.register('CONSULTER_GARANTIES_FINANCIÈRES', queryHandler);
};
