import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { type DocumentProjet, IdentifiantProjet } from '../../../index.js';
import type { DemandeRecoursEntity } from '../demandeRecours.entity.js';
import { DocumentRecours } from '../index.js';
import type { RecoursEntity } from '../recours.entity.js';
import * as StatutRecours from '../statutRecours.valueType.js';

export type ConsulterRecoursReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutRecours.ValueType;
  dateDemande: DateTime.ValueType;
  accord?: {
    date: DateTime.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    dateRéponseSignée?: DateTime.ValueType;
  };
};

export type ConsulterRecoursQuery = Message<
  'Éliminé.Recours.Query.ConsulterRecours',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterRecoursReadModel>
>;

export type ConsulterRecoursDependencies = {
  find: Find;
};

export const registerConsulterRecoursQuery = ({ find }: ConsulterRecoursDependencies) => {
  const handler: MessageHandler<ConsulterRecoursQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const recours = await find<RecoursEntity>(`recours|${identifiantProjet.formatter()}`);

    if (Option.isNone(recours)) {
      return Option.none;
    }

    if (StatutRecours.convertirEnValueType(recours.dernièreDemande.statut).estAccordé()) {
      const détail = await find<DemandeRecoursEntity>(
        `demande-recours|${identifiantProjet.formatter()}#${recours.dernièreDemande.date}`,
      );

      return Option.match(détail)
        .some((détailDemande) => mapToReadModel({ ...recours, demande: détailDemande.demande }))
        .none();
    }

    return Option.match(recours).some(mapToReadModel).none();
  };
  mediator.register('Éliminé.Recours.Query.ConsulterRecours', handler);
};

const mapToReadModel = (
  entity: RecoursEntity & { readonly demande?: DemandeRecoursEntity['demande'] },
): ConsulterRecoursReadModel => {
  const accord = entity.demande?.accord;
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    statut: StatutRecours.convertirEnValueType(entity.dernièreDemande.statut),
    dateDemande: DateTime.convertirEnValueType(entity.dernièreDemande.date),
    accord: accord
      ? {
          date: DateTime.convertirEnValueType(accord.accordéLe),
          réponseSignée: DocumentRecours.recoursAccordé({
            identifiantProjet: entity.identifiantProjet,
            dateRéponseSignée: accord.dateRéponseSignée || accord.accordéLe,
            réponseSignée: accord.réponseSignée,
          }),
          dateRéponseSignée: accord.dateRéponseSignée
            ? DateTime.convertirEnValueType(accord.dateRéponseSignée)
            : undefined,
        }
      : undefined,
  };
};
