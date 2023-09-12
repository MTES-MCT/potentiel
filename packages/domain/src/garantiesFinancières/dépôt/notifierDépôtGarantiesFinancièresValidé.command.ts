import { Message, MessageHandler, mediator } from 'mediateur';
import { format } from 'date-fns';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate } from '@potentiel/core-domain';
import { RécupérerLesPorteursÀNotifierPort, EnvoyerEmailPort } from '../../domain.ports';
import { isNone } from '@potentiel/monads';
import { PorteursÀNotifierNonTrouvésErreur } from '../garantiesFinancières.error';

export type NotifierDépôtGarantiesFinancièresValidéCommand = Message<
  'NOTIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_VALIDÉ',
  {
    identifiantProjet: IdentifiantProjetValueType;
    nomProjet: string;
  }
>;

export type NotifierDépôtGarantiesFinancièresValidéDependencies = {
  loadAggregate: LoadAggregate;
  notifierPorteursDépôtGarantiesFinancièresValidé: EnvoyerEmailPort;
  récupérerLesPorteursÀNotifier: RécupérerLesPorteursÀNotifierPort;
};

export const registerNotifierDépôtGarantiesFinancièresValidéCommand = ({
  récupérerLesPorteursÀNotifier,
  notifierPorteursDépôtGarantiesFinancièresValidé,
}: NotifierDépôtGarantiesFinancièresValidéDependencies) => {
  const handler: MessageHandler<NotifierDépôtGarantiesFinancièresValidéCommand> = async ({
    identifiantProjet,
    nomProjet,
  }) => {
    const porteursÀNotifier = await récupérerLesPorteursÀNotifier({
      identifiantProjet,
    });

    if (isNone(porteursÀNotifier)) {
      throw new PorteursÀNotifierNonTrouvésErreur();
    }

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
        // TODO : récupérer la dreal dans un adapter ou depuis une query dans le controller ?
        dreal: 'TEST',
        dateDépôt: format(new Date(), 'dd/MM/yyyy'),
      },
    });
  };

  mediator.register('NOTIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_VALIDÉ', handler);
};
