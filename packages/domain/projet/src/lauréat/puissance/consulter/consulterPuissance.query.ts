import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import type { Find, Joined } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../..';
import { type CandidatureEntity, UnitéPuissance } from '../../../candidature';
import type { PuissanceEntity } from '..';

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
    const puissance = await find<PuissanceEntity, CandidatureEntity>(
      `puissance|${identifiantProjet}`,
      { join: { entity: 'candidature', on: 'identifiantProjet' } },
    );

    if (Option.isNone(puissance)) {
      return Option.none;
    }
    const appelOffres = await find<AppelOffre.AppelOffreEntity>(
      `appel-offre|${puissance.candidature.appelOffre}`,
    );
    if (Option.isNone(appelOffres)) {
      return Option.none;
    }
    return mapToReadModel(puissance, appelOffres);
  };
  mediator.register('Lauréat.Puissance.Query.ConsulterPuissance', handler);
};

type MapToReadModel = (
  puissance: PuissanceEntity & Joined<CandidatureEntity>,
  appelOffres: AppelOffre.AppelOffreEntity,
) => ConsulterPuissanceReadModel;

export const mapToReadModel: MapToReadModel = (
  {
    identifiantProjet,
    puissance,
    dateDemandeEnCours,
    candidature: { puissanceProductionAnnuelle: puissanceInitiale, période, technologie },
  },
  appelOffres,
) => ({
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
