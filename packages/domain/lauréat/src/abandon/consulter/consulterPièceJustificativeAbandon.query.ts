import { Message, MessageHandler, mediator } from 'mediateur';

import { Option, isNone, none } from '@potentiel/monads';
import { RécupérerPièceJustificativeAbandonPort } from '../abandon.port';
import {
  AbandonReadModel,
  AbandonReadModelKey,
  PièceJustificativeAbandonReadModel,
} from '../abandon.readmodel';
import { DateTime, IdentifiantProjet, QueryPorts } from '@potentiel-domain/common';

export type ConsulterPièceJustificativeAbandonProjetQuery = Message<
  'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
  {
    identifiantProjet: IdentifiantProjet.RawType | IdentifiantProjet.PlainType;
  },
  Option<PièceJustificativeAbandonReadModel>
>;

export type ConsulterPièceJustificativeAbandonProjetDependencies = {
  find: QueryPorts.Find;
  récupérerPièceJustificativeAbandon: RécupérerPièceJustificativeAbandonPort;
};

export const registerConsulterPièceJustificativeAbandonProjetQuery = ({
  find,
  récupérerPièceJustificativeAbandon,
}: ConsulterPièceJustificativeAbandonProjetDependencies) => {
  const handler: MessageHandler<ConsulterPièceJustificativeAbandonProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = IdentifiantProjet.estUnPlainType(identifiantProjet)
      ? IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()
      : identifiantProjet;

    const key: AbandonReadModelKey = `abandon|${rawIdentifiantProjet}`;

    const abandon = await find<AbandonReadModel>(key);

    if (isNone(abandon) || !abandon.demandePièceJustificativeFormat) {
      return none;
    }

    const content = await récupérerPièceJustificativeAbandon({
      datePièceJustificativeAbandon: DateTime.convertirEnValueType(abandon.demandeDemandéLe),
      format: abandon.demandePièceJustificativeFormat,
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
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
