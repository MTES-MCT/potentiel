import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Option } from '@potentiel/monads';
import { Find } from '@potentiel/core-domain-views';
import {
  SuiviDépôtGarantiesFinancièresReadModel,
  SuiviDépôtGarantiesFinancièresReadModelKey,
} from '../suiviDesDépôts.readModel';

export type ConsulterSuiviDépôtGarantiesFinancièresQuery = Message<
  'CONSULTER_SUIVI_DÉPÔT_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<SuiviDépôtGarantiesFinancièresReadModel>
>;

export type ConsulterSuiviDépôtGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterSuiviDépôtGarantiesFinancièresQuery = ({
  find,
}: ConsulterSuiviDépôtGarantiesFinancièresDependencies) => {
  const queryHandler: MessageHandler<ConsulterSuiviDépôtGarantiesFinancièresQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: SuiviDépôtGarantiesFinancièresReadModelKey = `suivi-dépôt-garanties-financières|${rawIdentifiantProjet}`;
    const result = await find<SuiviDépôtGarantiesFinancièresReadModel>(key);

    return result;
  };

  mediator.register('CONSULTER_SUIVI_DÉPÔT_GARANTIES_FINANCIÈRES', queryHandler);
};
