import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Find } from '@potentiel-domain/entity';

import { LauréatEntity } from '../../lauréat.entity';
import { IdentifiantProjet } from '../../..';

export type ConsulterCahierDesChargesChoisiReadModel =
  | AppelOffre.CahierDesChargesModifié
  | { type: 'initial' };

export type ConsulterCahierDesChargesChoisiQuery = Message<
  'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterCahierDesChargesChoisiReadModel>
>;

export type ConsulterCahierDesChargesChoisiPort = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Option.Type<string>>;

export type ConsulterCahierDesChargesChoisiDependencies = {
  find: Find;
};

export const registerConsulterCahierDesChargesChoisiQuery = ({
  find,
}: ConsulterCahierDesChargesChoisiDependencies) => {
  const handler: MessageHandler<ConsulterCahierDesChargesChoisiQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
    const { appelOffre, période } = identifiantProjetValueType;

    const lauréat = await find<LauréatEntity>(`lauréat|${identifiantProjet}`);

    if (Option.isNone(lauréat)) {
      return Option.none;
    }

    const cahierDesChargesChoisi = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
      lauréat.cahierDesCharges,
    );

    if (cahierDesChargesChoisi.type === 'initial') {
      return cahierDesChargesChoisi;
    }

    const appelOffres = await find<AppelOffre.AppelOffreEntity>(`appel-offre|${appelOffre}`);
    if (Option.isNone(appelOffres)) {
      return Option.none;
    }

    const périodeDetails = appelOffres.periodes.find((periode) => periode.id === période);
    if (!périodeDetails) {
      return Option.none;
    }

    const cahierDesChargesModifié = périodeDetails.cahiersDesChargesModifiésDisponibles.find((c) =>
      cahierDesChargesChoisi.estÉgaleÀ(AppelOffre.RéférenceCahierDesCharges.bind(c)),
    );

    if (!cahierDesChargesModifié) {
      return Option.none;
    }
    return cahierDesChargesModifié;
  };

  mediator.register('Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi', handler);
};
