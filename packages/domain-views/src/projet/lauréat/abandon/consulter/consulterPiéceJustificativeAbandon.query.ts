import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';

import { Option, isNone, none } from '@potentiel/monads';
import { Find } from '@potentiel/core-domain-views';
import { RécupérerPiéceJustificativeAbandonProjetPort } from '../abandon.port';
import {
  AbandonReadModel,
  AbandonReadModelKey,
  PiéceJustificativeAbandonProjetReadModel,
} from '../abandon.readmodel';

export type ConsulterPiéceJustificativeAbandonProjetQuery = Message<
  'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<PiéceJustificativeAbandonProjetReadModel>
>;

export type ConsulterPiéceJustificativeAbandonProjetDependencies = {
  find: Find;
  récupérerPiéceJustificativeAbandonProjet: RécupérerPiéceJustificativeAbandonProjetPort;
};

export const registerConsulterPiéceJustificativeAbandonProjetQuery = ({
  find,
  récupérerPiéceJustificativeAbandonProjet,
}: ConsulterPiéceJustificativeAbandonProjetDependencies) => {
  const handler: MessageHandler<ConsulterPiéceJustificativeAbandonProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: AbandonReadModelKey = `abandon|${rawIdentifiantProjet}`;

    const abandon = await find<AbandonReadModel>(key);

    if (isNone(abandon)) {
      return none;
    }

    const content = await récupérerPiéceJustificativeAbandonProjet(
      rawIdentifiantProjet,
      abandon.demandePiéceJustificativeFormat || '',
    );

    if (!content) {
      return none;
    }

    return {
      type: 'piéce-justificative-abandon-projet',
      format: abandon.demandePiéceJustificativeFormat || '',
      content,
    } satisfies PiéceJustificativeAbandonProjetReadModel;
  };
  mediator.register('CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET', handler);
};
