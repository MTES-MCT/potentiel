import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Find } from '@potentiel-domain/entity';

import { LauréatEntity } from '../lauréat.entity';

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
  consulterCahierDesChargesAdapter: ConsulterCahierDesChargesChoisiPort;
  find: Find;
};

export const registerConsulterCahierDesChargesChoisiQuery = ({
  consulterCahierDesChargesAdapter,
  find,
}: ConsulterCahierDesChargesChoisiDependencies) => {
  const handler: MessageHandler<ConsulterCahierDesChargesChoisiQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
    const { appelOffre, période } = identifiantProjetValueType;

    const cahierDesChargesChoisiValue =
      process.env.MIGRATION_CDC === 'true'
        ? await find<LauréatEntity>(`lauréat|${identifiantProjet}`).then((lauréat) =>
            Option.match(lauréat)
              .some((lauréat) => lauréat.cahierDesCharges)
              .none(),
          )
        : await consulterCahierDesChargesAdapter(identifiantProjetValueType);

    if (Option.isNone(cahierDesChargesChoisiValue)) {
      return Option.none;
    }

    const cahierDesChargesChoisi = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
      cahierDesChargesChoisiValue,
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
