import { Message, MessageHandler, mediator } from 'mediateur';
import { isSome } from '@potentiel/monads';
import { DépôtGarantiesFinancièresReadModel } from '../dépôtGarantiesFinancières.readModel';
import { RécupérerDétailProjetPort } from '../../domainViews.port';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { ProjetReadModel } from '../../domainViews.readModel';
import { List } from '@potentiel/core-domain';

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
    pagination: { currentPage: number; pageCount: number };
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
      like: { région },
      pagination: { page, itemsPerPage },
    });

    const liste: {
      dépôt: DépôtGarantiesFinancièresReadModel;
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
    }[] = [];

    await Promise.all(
      dépôts.items.map(async (dépôt) => {
        const projet = await récupérerDétailProjet(
          convertirEnIdentifiantProjet(dépôt.identifiantProjet),
        );
        if (isSome(projet)) {
          liste.push({
            dépôt,
            projet,
          });
        }
      }),
    );

    return {
      type: 'liste-dépôts-garanties-financières',
      région,
      liste,
      pagination: {
        currentPage: dépôts.currentPage,
        pageCount: Math.ceil(dépôts.totalItems / dépôts.itemsPerPage),
      },
    };
  };

  mediator.register('LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES', queryHandler);
};
