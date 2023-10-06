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
import { RécupérerPiéceJustificativeAbandonPort } from '../abandon.port';
import {
  AbandonReadModel,
  AbandonReadModelKey,
  PiéceJustificativeAbandonReadModel,
} from '../abandon.readmodel';

export type ConsulterPiéceJustificativeAbandonProjetQuery = Message<
  'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<PiéceJustificativeAbandonReadModel>
>;

export type ConsulterPiéceJustificativeAbandonProjetDependencies = {
  find: Find;
  récupérerPiéceJustificativeAbandon: RécupérerPiéceJustificativeAbandonPort;
};

export const registerConsulterPiéceJustificativeAbandonProjetQuery = ({
  find,
  récupérerPiéceJustificativeAbandon,
}: ConsulterPiéceJustificativeAbandonProjetDependencies) => {
  const handler: MessageHandler<ConsulterPiéceJustificativeAbandonProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: AbandonReadModelKey = `abandon|${rawIdentifiantProjet}`;

    const abandon = await find<AbandonReadModel>(key);

    if (isNone(abandon) || !abandon.demandePiéceJustificativeFormat) {
      return none;
    }

    const content = await récupérerPiéceJustificativeAbandon({
      datePiéceJustificativeAbandon: convertirEnDateTime(abandon.demandeDemandéLe),
      format: abandon.demandePiéceJustificativeFormat,
      identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
    });

    if (!content) {
      return none;
    }

    return {
      type: 'piéce-justificative-abandon',
      format: abandon.demandePiéceJustificativeFormat,
      content,
    } satisfies PiéceJustificativeAbandonReadModel;
  };
  mediator.register('CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET', handler);
};
