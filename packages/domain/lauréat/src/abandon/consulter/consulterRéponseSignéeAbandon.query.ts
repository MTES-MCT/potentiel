import { Message, MessageHandler, mediator } from 'mediateur';

import { Option, isNone, none } from '@potentiel/monads';
import { RécupérerRéponseSignéeAbandonPort } from '../abandon.port';
import {
  AbandonReadModel,
  AbandonReadModelKey,
  RéponseSignéeAbandonReadModel,
} from '../abandon.readmodel';
import { Find } from '../../../common/common.port';
import { convertirEnDateTime } from '../../../common/dateTime.valueType';
import {
  RawIdentifiantProjet,
  IdentifiantProjet,
  estUnIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '../../../common/projet.valueType';
import { RéponseSignée } from '../abandon.valueType';

export type ConsulterRéponseSignéeAbandonQuery = Message<
  'CONSULTER_RÉPONSE_SIGNÉE_ABANDON_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
    type: RéponseSignée['type'];
  },
  Option<RéponseSignéeAbandonReadModel>
>;

export type ConsulterRéponseSignéeAbandonDependencies = {
  find: Find;
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
  mediator.register('CONSULTER_RÉPONSE_SIGNÉE_ABANDON_PROJET', handler);
};
