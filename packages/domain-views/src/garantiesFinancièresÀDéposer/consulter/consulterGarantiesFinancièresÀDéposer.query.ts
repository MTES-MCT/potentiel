import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Option } from '@potentiel/monads';
import { Find } from '@potentiel/core-domain';
import {
  GarantiesFinancièresÀDéposerReadModel,
  GarantiesFinancièresÀDéposerReadModelKey,
} from '../garantiesFinancièresÀDéposer.readModel';

export type ConsulterGarantiesFinancièresÀDéposerQuery = Message<
  'CONSULTER_GARANTIES_FINANCIÈRES_À_DÉPOSER',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<GarantiesFinancièresÀDéposerReadModel>
>;

export type ConsulterGarantiesFinancièresÀDéposerDependencies = {
  find: Find;
};

export const registerConsulterGarantiesFinancièresÀDéposerQuery = ({
  find,
}: ConsulterGarantiesFinancièresÀDéposerDependencies) => {
  const queryHandler: MessageHandler<ConsulterGarantiesFinancièresÀDéposerQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: GarantiesFinancièresÀDéposerReadModelKey = `garanties-financières-à-déposer|${rawIdentifiantProjet}`;
    const result = await find<GarantiesFinancièresÀDéposerReadModel>(key);

    return result;
  };

  mediator.register('CONSULTER_GARANTIES_FINANCIÈRES_À_DÉPOSER', queryHandler);
};
