import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Option } from '@potentiel/monads';
import {
  DépôtGarantiesFinancièresReadModel,
  DépôtGarantiesFinancièresReadModelKey,
} from '../dépôtGarantiesFinancières.readModel';
import { Find } from '@potentiel/core-domain';

export type ConsulterDépôtGarantiesFinancièresQuery = Message<
  'CONSULTER_DÉPÔT_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<DépôtGarantiesFinancièresReadModel>
>;

export type ConsulterDépôtGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterDépôtGarantiesFinancièresQuery = ({
  find,
}: ConsulterDépôtGarantiesFinancièresDependencies) => {
  const queryHandler: MessageHandler<ConsulterDépôtGarantiesFinancièresQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: DépôtGarantiesFinancièresReadModelKey = `dépôt-garanties-financières|${rawIdentifiantProjet}`;
    const result = await find<DépôtGarantiesFinancièresReadModel>(key);

    return result;
  };

  mediator.register('CONSULTER_DÉPÔT_GARANTIES_FINANCIÈRES', queryHandler);
};
