import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PuissanceEntity } from '..';
import { IdentifiantProjet } from '../../..';

export type ConsulterPuissanceReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  unitéPuissance: string;
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
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const puissance = await find<PuissanceEntity>(
      `puissance|${identifiantProjetValueType.formatter()}`,
    );

    const appelOffre = await find<AppelOffre.AppelOffreEntity>(
      `appel-offre|${identifiantProjetValueType.appelOffre}`,
    );

    if (Option.isNone(appelOffre) || Option.isNone(puissance)) {
      return Option.none;
    }

    return mapToReadModel({ identifiantProjet: identifiantProjetValueType, puissance, appelOffre });
  };
  mediator.register('Lauréat.Puissance.Query.ConsulterPuissance', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  puissance,
  appelOffre,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: PuissanceEntity;
  appelOffre: AppelOffre.AppelOffreEntity;
}) => ({
  identifiantProjet,
  puissance: puissance.puissance,
  dateDemandeEnCours: puissance.dateDemandeEnCours
    ? DateTime.convertirEnValueType(puissance.dateDemandeEnCours)
    : undefined,
  unitéPuissance: appelOffre.unitePuissance,
});
