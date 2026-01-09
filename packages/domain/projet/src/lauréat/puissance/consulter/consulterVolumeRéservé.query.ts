import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Candidature } from '../../..';
import { VolumeRéservé } from '..';

export type ConsulterVolumeRéservéReadModel = VolumeRéservé.ValueType;

export type ConsulterVolumeRéservéQuery = Message<
  'Lauréat.Puissance.Query.ConsulterVolumeRéservé',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterVolumeRéservéReadModel>
>;

export type ConsulterVolumeRéservéDependencies = {
  find: Find;
};

export const registerConsulterVolumeRéservéQuery = ({
  find,
}: ConsulterVolumeRéservéDependencies) => {
  const handler: MessageHandler<ConsulterVolumeRéservéQuery> = async ({ identifiantProjet }) => {
    const candidature = await find<Candidature.CandidatureEntity, AppelOffre.AppelOffreEntity>(
      `candidature|${identifiantProjet}`,
      {
        join: {
          entity: 'appel-offre',
          on: 'appelOffre',
        },
      },
    );

    if (Option.isNone(candidature)) {
      return Option.none;
    }

    const période = candidature['appel-offre'].periodes.find((p) => p.id === candidature.période);
    if (!période) {
      return Option.none;
    }

    return (
      VolumeRéservé.déterminer({
        note: candidature.noteTotale,
        puissanceInitiale: candidature.puissance,
        période,
      }) ?? Option.none
    );
  };

  mediator.register('Lauréat.Puissance.Query.ConsulterVolumeRéservé', handler);
};
