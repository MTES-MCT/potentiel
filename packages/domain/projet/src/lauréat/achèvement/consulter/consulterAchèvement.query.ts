import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../..';
import { DateAchèvementPrévisionnel } from '..';
import type { AchèvementEntity } from '../achèvement.entity';

export type ConsulterAchèvementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateAchèvementPrévisionnel: DateAchèvementPrévisionnel.ValueType;
};

export type ConsulterAchèvementQuery = Message<
  'Lauréat.Achèvement.Query.ConsulterAchèvement',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterAchèvementReadModel>
>;

export type ConsulterAchèvementDependencies = {
  find: Find;
};

export const registerConsulterAchèvementQuery = ({ find }: ConsulterAchèvementDependencies) => {
  const handler: MessageHandler<ConsulterAchèvementQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const achèvementEntity = await find<AchèvementEntity>(
      `achèvement|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(achèvementEntity)) {
      return Option.none;
    }

    return mapToReadModel(achèvementEntity);
  };

  mediator.register('Lauréat.Achèvement.Query.ConsulterAchèvement', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  dateAchèvementPrévisionnel,
}: AchèvementEntity): ConsulterAchèvementReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    dateAchèvementPrévisionnel: DateAchèvementPrévisionnel.convertirEnValueType(
      dateAchèvementPrévisionnel,
    ),
  };
};
