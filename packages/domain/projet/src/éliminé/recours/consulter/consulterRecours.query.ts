import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import * as StatutRecours from '../statutRecours.valueType';
import { IdentifiantProjet } from '../../..';
import { RecoursEntity } from '../recours.entity';
import { DemandeRecoursEntity } from '../demandeRecours.entity';

export type ConsulterRecoursReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutRecours.ValueType;
  dateDemande: DateTime.ValueType;
  dateAccord?: DateTime.ValueType;
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
        .some((détailDemande) =>
          mapToReadModel({ ...recours, accordéLe: détailDemande.demande.accord?.accordéLe }),
        )
        .none();
    }

    return Option.match(recours).some(mapToReadModel).none();
  };
  mediator.register('Éliminé.Recours.Query.ConsulterRecours', handler);
};

const mapToReadModel = (
  entity: RecoursEntity & { readonly accordéLe?: string },
): ConsulterRecoursReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    statut: StatutRecours.convertirEnValueType(entity.dernièreDemande.statut),
    dateDemande: DateTime.convertirEnValueType(entity.dernièreDemande.date),
    dateAccord: entity.accordéLe ? DateTime.convertirEnValueType(entity.accordéLe) : undefined,
  };
};
