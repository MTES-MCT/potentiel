import { Message, MessageHandler, mediator } from 'mediateur';
import { List } from '../../common.port';
import { isSome } from '@potentiel/monads';
import {
  DépôtGarantiesFinancièresReadModel,
  RégionFrançaise,
} from '../dépôtGarantiesFinancières.readModel';
import { RécupérerDétailProjetPort } from '../../domainViews.port';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { ProjetReadModel } from '../../domainViews.readModel';

type ListerDépôtsGarantiesFinancièresReadModel = {
  type: 'liste-dépôts-garanties-financières';
  région?: RégionFrançaise;
  liste: ReadonlyArray<
    | {
        dépôt: DépôtGarantiesFinancièresReadModel;
        projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>;
      }
    | undefined // TO DO : à retirer
  >;
};

export type ListerDépôtsGarantiesFinancièresQuery = Message<
  'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES',
  {
    région?: RégionFrançaise;
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
  }) => {
    const dépôts = await list<DépôtGarantiesFinancièresReadModel>({
      type: 'dépôt-garanties-financières',
      orderBy: 'dateDernièreMiseÀJour',
      // TO DO : ajouter un where sur la région ici
    });

    if (!dépôts.length) {
      return { type: 'liste-dépôts-garanties-financières', liste: [], ...(région && { région }) };
    }

    const liste = await Promise.all(
      dépôts.map(async (dépôt) => {
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
      ...(région && { région }),
      liste: listeFiltrée,
    };
  };

  mediator.register('LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES', queryHandler);
};
