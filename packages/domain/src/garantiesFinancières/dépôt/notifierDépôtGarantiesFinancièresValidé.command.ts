import { Message, MessageHandler, mediator } from 'mediateur';
import { format } from 'date-fns';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate } from '@potentiel/core-domain';
import { loadGarantiesFinancièresAggregateFactory } from '../garantiesFinancières.aggregate';
import { EnvoyerEmailPort } from '../../common.ports';
// import { LoadAggregate } from '@potentiel/core-domain';
// import { loadGarantiesFinancièresAggregateFactory } from '../garantiesFinancières.aggregate';
// import { isNone } from '@potentiel/monads';
// import { DépôtGarantiesFinancièresNonTrouvéErreur } from '../garantiesFinancières.error';

export type NotifierDépôtGarantiesFinancièresValidéCommand = Message<
  'NOTIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_VALIDÉ',
  {
    identifiantProjet: IdentifiantProjetValueType;
    nomProjet: string;
    porteursÀNotifier: {
      name: string;
      email: string;
    }[];
  }
>;

export type NotifierDépôtGarantiesFinancièresValidéDependencies = {
  loadAggregate: LoadAggregate;
  notifierPorteursDépôtGarantiesFinancièresValidé: EnvoyerEmailPort;
};

export const registerNotifierDépôtGarantiesFinancièresValidéCommand = ({
  loadAggregate,
  notifierPorteursDépôtGarantiesFinancièresValidé,
}: NotifierDépôtGarantiesFinancièresValidéDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<NotifierDépôtGarantiesFinancièresValidéCommand> = async ({
    identifiantProjet,
    nomProjet,
    porteursÀNotifier,
  }) => {
    /*
      // QUESTION : Est-ce que je dois vérifier ici que l'aggrégat a bien des nouvelles GFs ?

      // const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

      // if (isNone(agrégatGarantiesFinancières) || !agrégatGarantiesFinancières.actuelles) {
      //   throw new DépôtGarantiesFinancièresNonTrouvéErreur();
      // }

      // TO DO : AJouter une adapter pour aller récupérer les porteurs associés à un projet, pour les notifier
    */

    await notifierPorteursDépôtGarantiesFinancièresValidé({
      type: 'notifier-pp-gf-validé',
      templateId: 12345678910,
      contexte: {
        identifiantProjet: identifiantProjet.formatter(),
      },
      message: {
        objet: 'Validation du dépôt des des garanties financières',
        destinataires: porteursÀNotifier,
      },
      variables: {
        nomProjet,
        dreal: 'TEST',
        dateDépôt: format(new Date(), 'dd/MM/yyyy'),
      },
    });
  };

  mediator.register('NOTIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_VALIDÉ', handler);
};
