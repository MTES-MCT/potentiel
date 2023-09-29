import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  RéponseSignée,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';

import { Option, isNone, none } from '@potentiel/monads';
import { Find } from '@potentiel/core-domain-views';
import { RécupérerRéponseSignéeAbandonPort } from '../abandon.port';
import {
  AbandonReadModel,
  AbandonReadModelKey,
  RéponseSignéeAbandonReadModel,
} from '../abandon.readmodel';

export type ConsulterRéponseSignéeAbandonQuery = Message<
  'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
    type: RéponseSignée['type'];
  },
  Option<RéponseSignéeAbandonReadModel>
>;

export type ConsulterRéponseSignéeDependencies = {
  find: Find;
  récupérerRéponseSignée: RécupérerRéponseSignéeAbandonPort;
};

export const registerConsulterRéponseSignéeQuery = ({
  find,
  récupérerRéponseSignée,
}: ConsulterRéponseSignéeDependencies) => {
  const handler: MessageHandler<ConsulterRéponseSignéeAbandonQuery> = async ({
    identifiantProjet,
    type,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: AbandonReadModelKey = `abandon|${rawIdentifiantProjet}`;

    const abandon = await find<AbandonReadModel>(key);

    if (isNone(abandon)) {
      return none;
    }

    const date =
      type === 'abandon-accordé'
        ? abandon.accordAccordéLe
        : type === 'abandon-rejeté'
        ? abandon.rejetRejetéLe
        : abandon.confirmationDemandéLe;

    const format =
      type === 'abandon-accordé'
        ? abandon.accordRéponseSignéeFormat
        : type === 'abandon-rejeté'
        ? abandon.rejetRéponseSignéeFormat
        : abandon.confirmationDemandéRéponseSignéeFormat;

    if (!date || !format) {
      return none;
    }

    const content = await récupérerRéponseSignée({
      identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
      type,
      dateRécupérerRéponseSignée: convertirEnDateTime(date),
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
  mediator.register('CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET', handler);
};
