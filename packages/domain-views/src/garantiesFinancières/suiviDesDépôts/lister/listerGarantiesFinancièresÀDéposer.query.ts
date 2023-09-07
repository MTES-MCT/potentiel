import { Message, MessageHandler, mediator } from 'mediateur';
import { isSome } from '@potentiel/monads';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { List } from '@potentiel/core-domain-views';
import { RécupérerDétailProjetPort } from '../../../domainViews.port';
import { ProjetReadModel } from '../../../domainViews.readModel';
import { SuiviDépôtGarantiesFinancièresReadModel } from '../suiviDesDépôts.readModel';

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
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
    }[];
    pagination: { currentPage: number; pageCount: number };
  }
>;

export type ListerDépôtsGarantiesFinancièresEnAttenteDependencies = {
  list: List;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerListerDépôtsGarantiesFinancièresEnAttenteQuery = ({
  list,
  récupérerDétailProjet,
}: ListerDépôtsGarantiesFinancièresEnAttenteDependencies) => {
  const queryHandler: MessageHandler<ListerDépôtsGarantiesFinancièresEnAttenteQuery> = async ({
    région,
    pagination: { page, itemsPerPage },
  }) => {
    const dépôtsGarantiesFinancièresEnAttente = await list<SuiviDépôtGarantiesFinancièresReadModel>(
      {
        type: 'suivi-dépôt-garanties-financières',
        like: { région },
        where: { statutDépôt: 'en attente' },
        pagination: { page, itemsPerPage },
      },
    );

    const liste: {
      dateLimiteDépôt?: string;
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
    }[] = [];

    await Promise.all(
      dépôtsGarantiesFinancièresEnAttente.items.map(async (item) => {
        const projet = await récupérerDétailProjet(
          convertirEnIdentifiantProjet(item.identifiantProjet),
        );
        if (isSome(projet)) {
          liste.push({
            dateLimiteDépôt: item.dateLimiteDépôt,
            projet,
          });
        }
      }),
    );

    return {
      type: 'liste-suivi-dépôt-garanties-financières-en-attente',
      région,
      liste,
      pagination: {
        currentPage: dépôtsGarantiesFinancièresEnAttente.currentPage,
        pageCount: Math.ceil(
          dépôtsGarantiesFinancièresEnAttente.totalItems /
            dépôtsGarantiesFinancièresEnAttente.itemsPerPage,
        ),
      },
    };
  };

  mediator.register('LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES_EN_ATTENTE', queryHandler);
};
