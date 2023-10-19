import { Message, MessageHandler, mediator } from 'mediateur';

import { Option, isNone, none } from '@potentiel/monads';
import { DateTime, IdentifiantProjet, QueryPorts } from '@potentiel-domain/common';

import { RécupérerRéponseSignéeAbandonPort } from '../abandon.port';

import { AbandonReadModel, RéponseSignéeAbandonReadModel } from '../abandon.readmodel';

import * as Abandon from '../abandon.valueType';
import { AbandonInconnuErreur } from '../abandon.error';
import { RéponseSignéeValueType } from '../réponseSignée.valueType';

export type ConsulterRéponseSignéeAbandonQuery = Message<
  'CONSULTER_RÉPONSE_SIGNÉE_ABANDON_PROJET',
  {
    identifiantProjet: string;
    type: RéponseSignéeValueType['type'];
  },
  Option<RéponseSignéeAbandonReadModel>
>;

export type ConsulterRéponseSignéeAbandonDependencies = {
  find: QueryPorts.Find;
  récupérerRéponseSignée: RécupérerRéponseSignéeAbandonPort;
};

export const registerConsulterRéponseAbandonSignéeQuery = ({
  find,
  récupérerRéponseSignée,
}: ConsulterRéponseSignéeAbandonDependencies) => {
  const handler: MessageHandler<ConsulterRéponseSignéeAbandonQuery> = async ({
    identifiantProjet,
    type,
  }) => {
    const identifiantAbandon = Abandon.convertirEnValueType(identifiantProjet);

    const abandon = await find<AbandonReadModel>(identifiantAbandon.formatter());

    if (isNone(abandon)) {
      throw new AbandonInconnuErreur();
    }

    const date =
      type === 'abandon-accordé'
        ? abandon.accordAccordéLe
        : type === 'abandon-rejeté'
        ? abandon.rejetRejetéLe
        : abandon.confirmationDemandéeLe;

    const format =
      type === 'abandon-accordé'
        ? abandon.accordRéponseSignéeFormat
        : type === 'abandon-rejeté'
        ? abandon.rejetRéponseSignéeFormat
        : abandon.confirmationDemandéeRéponseSignéeFormat;

    if (!date || !format) {
      return none;
    }

    const content = await récupérerRéponseSignée({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      type,
      dateRécupérerRéponseSignée: DateTime.convertirEnValueType(date),
      format: format,
    });

    if (!content) {
      return none;
    }

    return {
      type: 'réponse-signée-abandon',
      format,
      content,
    } satisfies RéponseSignéeAbandonReadModel;
  };
  mediator.register('CONSULTER_RÉPONSE_SIGNÉE_ABANDON_PROJET', handler);
};
