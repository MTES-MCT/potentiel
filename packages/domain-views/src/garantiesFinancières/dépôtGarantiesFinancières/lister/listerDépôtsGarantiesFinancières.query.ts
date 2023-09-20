import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, isSome } from '@potentiel/monads';
import { DépôtGarantiesFinancièresReadModel } from '../dépôtGarantiesFinancières.readModel';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { List } from '@potentiel/core-domain-views';
import { RécupérerDétailProjetPort } from '../../../domainViews.port';
import { ProjetReadModel } from '../../../domainViews.readModel';

export type ListerDépôtsGarantiesFinancièresQuery = Message<
  'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES',
  {
    région: string;
    pagination: { page: number; itemsPerPage: number };
  },
  {
    type: 'liste-dépôts-garanties-financières';
    région: string;
    liste: {
      dépôt: DépôtGarantiesFinancièresReadModel;
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
    }[];
    pagination: { currentPage: number; pageCount: number; totalCount: number };
  }
>;

export type ListerDépôtsGarantiesFinancièresDependencies = {
  list: List;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerListerDépôtsGarantiesFinancièresQuery = ({
  list,
  récupérerDétailProjet,
}: ListerDépôtsGarantiesFinancièresDependencies) => {
  const queryHandler: MessageHandler<ListerDépôtsGarantiesFinancièresQuery> = async ({
    région,
    pagination: { page, itemsPerPage },
  }) => {
    const dépôts = await list<DépôtGarantiesFinancièresReadModel>({
      type: 'dépôt-garanties-financières',
      orderBy: 'dateDernièreMiseÀJour',
      sort: 'DESC',
      like: { région },
      pagination: { page, itemsPerPage },
    });

    const liste: {
      dépôt: DépôtGarantiesFinancièresReadModel;
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
    }[] = [];

    for (const dépôt of dépôts.items) {
      const projet = await récupérerDétailProjet(
        convertirEnIdentifiantProjet(dépôt.identifiantProjet),
      );
      if (isNone(projet)) {
        // TODO : erreur à logguer
      }

      if (isSome(projet)) {
        liste.push({
          dépôt,
          projet,
        });
      }
    }

    return {
      type: 'liste-dépôts-garanties-financières',
      région,
      liste,
      pagination: {
        currentPage: dépôts.currentPage,
        pageCount: Math.ceil(dépôts.totalItems / dépôts.itemsPerPage),
        totalCount: dépôts.totalItems,
      },
    };
  };

  mediator.register('LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES', queryHandler);
};
