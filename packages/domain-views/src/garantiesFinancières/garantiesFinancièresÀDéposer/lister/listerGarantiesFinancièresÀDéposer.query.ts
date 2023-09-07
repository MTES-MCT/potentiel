import { Message, MessageHandler, mediator } from 'mediateur';
import { isSome } from '@potentiel/monads';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { List } from '@potentiel/core-domain-views';
import { RécupérerDétailProjetPort } from '../../../domainViews.port';
import { ProjetReadModel } from '../../../domainViews.readModel';
import { GarantiesFinancièresÀDéposerReadModel } from '../garantiesFinancièresÀDéposer.readModel';

export type ListerGarantiesFinancièresÀDéposerQuery = Message<
  'LISTER_GARANTIES_FINANCIÈRES_À_DÉPOSER',
  {
    région: string;
    pagination: { page: number; itemsPerPage: number };
  },
  {
    type: 'liste-garanties-financières-à-déposer';
    région: string;
    liste: {
      dateLimiteDépôt?: string;
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
    }[];
    pagination: { currentPage: number; pageCount: number };
  }
>;

export type ListerGarantiesFinancièresÀDéposerDependencies = {
  list: List;
  récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerListerGarantiesFinancièresÀDéposerQuery = ({
  list,
  récupérerDétailProjet,
}: ListerGarantiesFinancièresÀDéposerDependencies) => {
  const queryHandler: MessageHandler<ListerGarantiesFinancièresÀDéposerQuery> = async ({
    région,
    pagination: { page, itemsPerPage },
  }) => {
    const garantiesFinancièresÀDéposer = await list<GarantiesFinancièresÀDéposerReadModel>({
      type: 'garanties-financières-à-déposer',
      like: { région },
      pagination: { page, itemsPerPage },
    });

    const liste: {
      dateLimiteDépôt?: string;
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
    }[] = [];

    await Promise.all(
      garantiesFinancièresÀDéposer.items.map(async (item) => {
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
      type: 'liste-garanties-financières-à-déposer',
      région,
      liste,
      pagination: {
        currentPage: garantiesFinancièresÀDéposer.currentPage,
        pageCount: Math.ceil(
          garantiesFinancièresÀDéposer.totalItems / garantiesFinancièresÀDéposer.itemsPerPage,
        ),
      },
    };
  };

  mediator.register('LISTER_GARANTIES_FINANCIÈRES_À_DÉPOSER', queryHandler);
};
