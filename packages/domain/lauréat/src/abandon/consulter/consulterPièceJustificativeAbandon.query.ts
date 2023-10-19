import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { DateTime, IdentifiantProjet, QueryPorts } from '@potentiel-domain/common';

import { RécupérerPièceJustificativeAbandonPort } from '../abandon.port';
import { AbandonReadModel, PièceJustificativeAbandonReadModel } from '../abandon.readmodel';
import * as Abandon from '../abandon.valueType';
import { AbandonInconnuErreur, PièceJustificativeAbandonInconnueErreur } from '../abandon.error';

export type ConsulterPièceJustificativeAbandonProjetQuery = Message<
  'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
  {
    identifiantProjet: string;
  },
  PièceJustificativeAbandonReadModel
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
    const identifiantAbandon = Abandon.convertirEnValueType(identifiantProjet);

    const abandon = await find<AbandonReadModel>(identifiantAbandon.formatter());

    if (isNone(abandon)) {
      throw new AbandonInconnuErreur();
    }

    if (!abandon.demandePièceJustificativeFormat) {
      throw new PièceJustificativeAbandonInconnueErreur('format');
    }

    const content = await récupérerPièceJustificativeAbandon({
      datePièceJustificativeAbandon: DateTime.convertirEnValueType(abandon.demandeDemandéLe),
      format: abandon.demandePièceJustificativeFormat,
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    });

    if (!content) {
      throw new PièceJustificativeAbandonInconnueErreur('contenu');
    }

    return {
      type: 'pièce-justificative-abandon',
      format: abandon.demandePièceJustificativeFormat,
      content,
    } satisfies PièceJustificativeAbandonReadModel;
  };
  mediator.register('CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET', handler);
};
