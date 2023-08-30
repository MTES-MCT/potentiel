import { Message, MessageHandler, mediator } from 'mediateur';
import { isSome } from '@potentiel/monads';
import { DépôtGarantiesFinancièresReadModel } from '../dépôtGarantiesFinancières.readModel';
import { RécupérerDétailProjetPort } from '../../domainViews.port';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { ProjetReadModel } from '../../domainViews.readModel';
import { List } from '@potentiel/core-domain';

type ListerDépôtsGarantiesFinancièresReadModel = {
  type: 'liste-dépôts-garanties-financières';
  région: string;
  liste: ReadonlyArray<
    | {
        dépôt: DépôtGarantiesFinancièresReadModel;
        projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
      }
    | undefined // TO DO : à retirer
  >;
  pagination: { currentPage: number; pageCount: number };
};

export type ListerDépôtsGarantiesFinancièresQuery = Message<
  'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES',
  {
    région: string;
    pagination: { page: number; itemsPerPage: number };
  },
  ListerDépôtsGarantiesFinancièresReadModel
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

    const liste = await Promise.all(
      dépôts.items.map(async (dépôt) => {
        const projet = await récupérerDétailProjet(
          convertirEnIdentifiantProjet(dépôt.identifiantProjet),
        );

        if (isSome(projet)) {
          return {
            dépôt,
            projet,
          };
        }
        // TO DO : logguer une erreur si pas de projet (ce cas ne devrait pas arriver)
        return undefined;
      }),
    );

    const listeFiltrée = liste.filter((item) => item !== undefined);

    return {
      type: 'liste-dépôts-garanties-financières',
      région,
      liste: listeFiltrée,
      pagination: {
        currentPage: dépôts.currentPage,
        pageCount: Math.ceil(dépôts.totalItems / dépôts.itemsPerPage),
      },
    };
  };

  mediator.register('LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES', queryHandler);
};
