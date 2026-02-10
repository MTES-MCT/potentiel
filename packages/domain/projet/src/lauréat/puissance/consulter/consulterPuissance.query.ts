import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find, Joined } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { PuissanceEntity } from '../index.js';
import { IdentifiantProjet } from '../../../index.js';
import { CandidatureEntity, UnitéPuissance } from '../../../candidature/index.js';

export type ConsulterPuissanceReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  puissanceInitiale: number;
  puissanceDeSite?: number;
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
      {
        join: { entity: 'candidature', on: 'identifiantProjet' },
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
  puissance: PuissanceEntity & Joined<[CandidatureEntity]>,
) => ConsulterPuissanceReadModel;

export const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  puissance,
  puissanceDeSite,
  dateDemandeEnCours,
  candidature: { puissance: puissanceInitiale, unitéPuissance },
}) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  puissance,
  puissanceInitiale,
  puissanceDeSite,
  dateDemandeEnCours: dateDemandeEnCours
    ? DateTime.convertirEnValueType(dateDemandeEnCours)
    : undefined,
  unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissance),
});
