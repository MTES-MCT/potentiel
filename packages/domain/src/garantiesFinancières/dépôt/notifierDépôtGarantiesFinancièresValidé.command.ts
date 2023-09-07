import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate } from '@potentiel/core-domain';
import { loadGarantiesFinancièresAggregateFactory } from '../garantiesFinancières.aggregate';
// import { LoadAggregate } from '@potentiel/core-domain';
// import { loadGarantiesFinancièresAggregateFactory } from '../garantiesFinancières.aggregate';
// import { isNone } from '@potentiel/monads';
// import { DépôtGarantiesFinancièresNonTrouvéErreur } from '../garantiesFinancières.error';

export type NotifierDépôtGarantiesFinancièresValidéCommand = Message<
  'NOTIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_VALIDÉ',
  {
    identifiantProjet: IdentifiantProjetValueType;
    porteursÀNotifier: {
      fullName: string;
      email: string;
    }[];
  }
>;

export type NotifierDépôtGarantiesFinancièresValidéDependencies = {
  loadAggregate: LoadAggregate;
  // notifierPorteursDépôtGarantiesFinancièresValidé: ;
};

export const registerNotifierDépôtGarantiesFinancièresValidéCommand = ({
  loadAggregate,
}: NotifierDépôtGarantiesFinancièresValidéDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<NotifierDépôtGarantiesFinancièresValidéCommand> = async ({
    identifiantProjet,
    porteursÀNotifier,
  }) => {
    /*
      // QUESTION : Est-ce que je dois vérifier ici que l'aggrégat a bien des nouvelles GFs ?

      // const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

      // if (isNone(agrégatGarantiesFinancières) || !agrégatGarantiesFinancières.actuelles) {
      //   throw new DépôtGarantiesFinancièresNonTrouvéErreur();
      // }
    */

    // TODO : Appeler l'adapter (passé en dépendance)

    // await notifierPorteurDépôtGarantiesFinancièresValidé({
    //   identifiantProjet,
    //   porteursÀNotifier,
    // });

    console.log('porteurs A notifier', porteursÀNotifier);
  };

  mediator.register('NOTIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_VALIDÉ', handler);
};
