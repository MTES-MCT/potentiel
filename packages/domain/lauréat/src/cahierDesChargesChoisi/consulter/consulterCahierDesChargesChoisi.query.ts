import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Find } from '@potentiel-domain/entity';

export type ConsulterCahierDesChargesChoisiReadmodel =
  | AppelOffre.CahierDesChargesModifié
  | { type: 'initial' };

export type ConsulterCahierDesChargesChoisiQuery = Message<
  'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterCahierDesChargesChoisiReadmodel>
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
    const cahierDesChargesChoisi = await consulterCahierDesChargesAdapter(
      identifiantProjetValueType,
    );

    if (Option.isNone(cahierDesChargesChoisi)) {
      return Option.none;
    }

    if (cahierDesChargesChoisi === 'initial') {
      return { type: 'initial' };
    }

    const appelOffres = await find<AppelOffre.AppelOffreEntity>(`appel-offre|${appelOffre}`);
    if (Option.isNone(appelOffres)) {
      return Option.none;
    }

    const périodeDetails = appelOffres.periodes.find((periode) => periode.id === période);
    if (!périodeDetails) {
      return Option.none;
    }

    const paruLe = cahierDesChargesChoisi.replace('-alternatif', '');
    const alternatif = cahierDesChargesChoisi.search('-alternatif') >= 0 ? true : undefined;
    console.log({ paruLe, alternatif });

    const cahierDesChargesModifié = périodeDetails.cahiersDesChargesModifiésDisponibles.find(
      (c) => c.paruLe === paruLe && c.alternatif === alternatif,
    );

    if (!cahierDesChargesModifié) {
      return Option.none;
    }
    return cahierDesChargesModifié;
  };

  mediator.register('Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi', handler);
};
