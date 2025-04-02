import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PuissanceEntity } from '..';

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

    return Option.match(puissance).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Puissance.Query.ConsulterPuissance', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  puissance,
  dateDemandeEnCours,
}: PuissanceEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  puissance,
  dateDemandeEnCours: dateDemandeEnCours
    ? DateTime.convertirEnValueType(dateDemandeEnCours)
    : undefined,
});
