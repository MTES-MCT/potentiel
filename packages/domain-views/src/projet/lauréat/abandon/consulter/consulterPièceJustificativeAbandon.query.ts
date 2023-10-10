import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';

import { Option, isNone, none } from '@potentiel/monads';
import { Find } from '@potentiel/core-domain-views';
import { RécupérerPièceJustificativeAbandonPort } from '../abandon.port';
import {
  AbandonReadModel,
  AbandonReadModelKey,
  PièceJustificativeAbandonReadModel,
} from '../abandon.readmodel';

export type ConsulterPièceJustificativeAbandonProjetQuery = Message<
  'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<PièceJustificativeAbandonReadModel>
>;

export type ConsulterPièceJustificativeAbandonProjetDependencies = {
  find: Find;
  récupérerPièceJustificativeAbandon: RécupérerPièceJustificativeAbandonPort;
};

export const registerConsulterPièceJustificativeAbandonProjetQuery = ({
  find,
  récupérerPièceJustificativeAbandon,
}: ConsulterPièceJustificativeAbandonProjetDependencies) => {
  const handler: MessageHandler<ConsulterPièceJustificativeAbandonProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: AbandonReadModelKey = `abandon|${rawIdentifiantProjet}`;

    const abandon = await find<AbandonReadModel>(key);

    if (isNone(abandon) || !abandon.demandePièceJustificativeFormat) {
      return none;
    }

    const content = await récupérerPièceJustificativeAbandon({
      datePièceJustificativeAbandon: convertirEnDateTime(abandon.demandeDemandéLe),
      format: abandon.demandePièceJustificativeFormat,
      identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
    });

    if (!content) {
      return none;
    }

    return {
      type: 'pièce-justificative-abandon',
      format: abandon.demandePièceJustificativeFormat,
      content,
    } satisfies PièceJustificativeAbandonReadModel;
  };
  mediator.register('CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET', handler);
};
