import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find, Joined } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PuissanceEntity } from '..';
import { IdentifiantProjet } from '../../..';
import { CandidatureEntity, UnitéPuissance } from '../../../candidature';

export type ConsulterPuissanceReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  puissanceInitiale: number;
  unitéPuissance: UnitéPuissance.ValueType;
  dateDemandeEnCours?: DateTime.ValueType;
};

export type ConsulterPuissanceQuery = Message<
  'Lauréat.Puissance.Query.ConsulterPuissance',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterPuissanceReadModel>
>;

export type ConsulterPuissanceDependencies = {
  find: Find;
};

export const registerConsulterPuissanceQuery = ({ find }: ConsulterPuissanceDependencies) => {
  const handler: MessageHandler<ConsulterPuissanceQuery> = async ({ identifiantProjet }) => {
    const puissance = await find<PuissanceEntity, [CandidatureEntity, AppelOffre.AppelOffreEntity]>(
      `puissance|${identifiantProjet}`,
      {
        join: [
          { entity: 'candidature', on: 'identifiantProjet' },
          { entity: 'appel-offre', on: 'appelOffres' },
        ],
      },
    );

    if (Option.isNone(puissance)) {
      return Option.none;
    }

    return mapToReadModel(puissance);
  };
  mediator.register('Lauréat.Puissance.Query.ConsulterPuissance', handler);
};

type MapToReadModel = (
  puissance: PuissanceEntity & Joined<[CandidatureEntity, AppelOffre.AppelOffreEntity]>,
) => ConsulterPuissanceReadModel;

export const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  puissance,
  dateDemandeEnCours,
  candidature: { puissanceProductionAnnuelle: puissanceInitiale, période, technologie },
  'appel-offre': appelOffres,
}) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  puissance,
  puissanceInitiale,
  dateDemandeEnCours: dateDemandeEnCours
    ? DateTime.convertirEnValueType(dateDemandeEnCours)
    : undefined,
  unitéPuissance: UnitéPuissance.déterminer({
    appelOffres,
    période,
    technologie,
  }),
});
