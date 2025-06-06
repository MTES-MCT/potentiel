import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { PuissanceEntity } from '..';
import { IdentifiantProjet } from '../../..';

export type ConsulterPuissanceReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
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

    if (Option.isNone(puissance)) {
      return Option.none;
    }
    return mapToReadModel({ identifiantProjet: identifiantProjetValueType, puissance });
  };
  mediator.register('Lauréat.Puissance.Query.ConsulterPuissance', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  puissance,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: PuissanceEntity;
}) => ({
  identifiantProjet,
  puissance: puissance.puissance,
  dateDemandeEnCours: puissance.dateDemandeEnCours
    ? DateTime.convertirEnValueType(puissance.dateDemandeEnCours)
    : undefined,
});
