import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Find } from '@potentiel-domain/entity';

import { LauréatEntity } from '../../lauréat.entity';
import { CahierDesCharges, IdentifiantProjet } from '../../..';
import { CandidatureEntity } from '../../../candidature';
import { mapToReadModel as mapToCandidatureReadModel } from '../../../candidature/consulter/consulterCandidature.query';

export type ConsulterCahierDesChargesReadModel = CahierDesCharges.ValueType;

export type ConsulterCahierDesChargesQuery = Message<
  'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterCahierDesChargesReadModel>
>;

export type ConsulterCahierDesChargesPort = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Option.Type<string>>;

export type ConsulterCahierDesChargesDependencies = {
  find: Find;
};

export const registerConsulterCahierDesChargesQuery = ({
  find,
}: ConsulterCahierDesChargesDependencies) => {
  const handler: MessageHandler<ConsulterCahierDesChargesQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const lauréat = await find<LauréatEntity, [CandidatureEntity, AppelOffre.AppelOffreEntity]>(
      `lauréat|${identifiantProjetValue}`,
      {
        join: [
          {
            entity: 'candidature',
            on: 'identifiantProjet',
          },
          {
            entity: 'appel-offre',
            on: 'appelOffre',
          },
        ],
      },
    );

    if (Option.isNone(lauréat)) {
      return Option.none;
    }

    const appelOffres = lauréat['appel-offre'];
    const période = appelOffres.periodes.find(
      (periode) => periode.id === identifiantProjet.période,
    );

    if (!période) {
      return Option.none;
    }

    const famille = période.familles?.find((famille) => famille.id === identifiantProjet.famille);
    if (identifiantProjet.famille && !famille) {
      return Option.none;
    }

    const candidatureReadModel = mapToCandidatureReadModel(lauréat.candidature);

    const cahierDesChargesChoisi = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
      lauréat.cahierDesCharges,
    );

    const cahierDesChargesModificatif = période.cahiersDesChargesModifiésDisponibles.find((c) =>
      cahierDesChargesChoisi.estÉgaleÀ(AppelOffre.RéférenceCahierDesCharges.bind(c)),
    );

    return CahierDesCharges.bind({
      appelOffre: appelOffres,
      période,
      famille,
      cahierDesChargesModificatif,
      technologie: candidatureReadModel.technologie.type,
    });
  };

  mediator.register('Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges', handler);
};
