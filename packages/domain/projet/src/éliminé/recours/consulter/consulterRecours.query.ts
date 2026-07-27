import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../../index.js';
import type { DemandeRecoursEntity } from '../demandeRecours.entity.js';
import type { RecoursEntity } from '../recours.entity.js';
import * as StatutRecours from '../statutRecours.valueType.js';

export type ConsulterRecoursReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutRecours.ValueType;
  dateDemande: DateTime.ValueType;
  dateAccord?: DateTime.ValueType;
  dateRéponseSignée?: DateTime.ValueType;
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
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    statut: StatutRecours.convertirEnValueType(entity.dernièreDemande.statut),
    dateDemande: DateTime.convertirEnValueType(entity.dernièreDemande.date),
    dateAccord: entity.demande?.accord?.accordéLe
      ? DateTime.convertirEnValueType(entity.demande?.accord?.accordéLe)
      : undefined,
    dateRéponseSignée: entity.demande?.accord?.dateRéponseSignée
      ? DateTime.convertirEnValueType(entity.demande.accord.dateRéponseSignée)
      : undefined,
  };
};
