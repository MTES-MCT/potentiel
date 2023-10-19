import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { DateTime, IdentifiantProjet, QueryPorts } from '@potentiel-domain/common';

import * as Abandon from '../abandon.valueType';
import { AbandonInconnuErreur } from '../abandonInconnu.error';
import { NotFoundError, ReadModel } from '@potentiel-domain/core';
import { AbandonReadModel } from './consulterAbandon.query';

export type PièceJustificativeAbandonReadModel = ReadModel<
  'pièce-justificative-abandon',
  { format: string; content: ReadableStream }
>;

export type ConsulterPièceJustificativeAbandonProjetQuery = Message<
  'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
  {
    identifiantProjet: string;
  },
  PièceJustificativeAbandonReadModel
>;

export type RécupérerPièceJustificativeAbandonPort = (options: {
  identifiantProjet: IdentifiantProjet.ValueType;
  format: string;
  datePièceJustificativeAbandon: DateTime.ValueType;
}) => Promise<ReadableStream | undefined>;

export type ConsulterPièceJustificativeAbandonProjetDependencies = {
  find: QueryPorts.Find;
  récupérerPièceJustificativeAbandon: RécupérerPièceJustificativeAbandonPort;
};

export class PièceJustificativeAbandonInconnueErreur extends NotFoundError {
  constructor(raison: 'format' | 'contenu') {
    super(`Pièce justificative abandon inconnue`, {
      raison,
    });
  }
}

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
