import { Message, MessageHandler, mediator } from 'mediateur';
import { ProjetReadModel } from '../../../domainViews.readModel';
import { ListerDépôtsGarantiesFinancièresEnAttentePort } from '../suiviDesDépôts.port';

export type ListerDépôtsGarantiesFinancièresEnAttenteQuery = Message<
  'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES_EN_ATTENTE',
  {
    région: string;
    pagination: { page: number; itemsPerPage: number };
  },
  {
    type: 'liste-suivi-dépôt-garanties-financières-en-attente';
    région: string;
    liste: {
      dateLimiteDépôt?: string;
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire' | 'statut'>;
    }[];
    pagination: { currentPage: number; pageCount: number };
  }
>;

export type ListerDépôtsGarantiesFinancièresEnAttenteDependencies = {
  listerDépôtsGarantiesFinancièresEnAttente: ListerDépôtsGarantiesFinancièresEnAttentePort;
};

export const registerListerDépôtsGarantiesFinancièresEnAttenteQuery = ({
  listerDépôtsGarantiesFinancièresEnAttente,
}: ListerDépôtsGarantiesFinancièresEnAttenteDependencies) => {
  const queryHandler: MessageHandler<ListerDépôtsGarantiesFinancièresEnAttenteQuery> = async ({
    région,
    pagination,
  }) => {
    const résultat = await listerDépôtsGarantiesFinancièresEnAttente({ région, pagination });

    return {
      type: 'liste-suivi-dépôt-garanties-financières-en-attente',
      région,
      liste: résultat.items,
      pagination: {
        currentPage: pagination.page,
        pageCount: Math.ceil(résultat.totalCount / pagination.itemsPerPage),
      },
    };
  };

  mediator.register('LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES_EN_ATTENTE', queryHandler);
};
