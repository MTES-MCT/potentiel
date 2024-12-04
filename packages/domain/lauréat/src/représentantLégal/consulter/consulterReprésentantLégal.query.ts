import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { TypeReprésentantLégal } from '..';
import { Lauréat } from '../..';

export type ConsulterReprésentantLégalReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
};

export type ConsulterReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterReprésentantLégalReadModel>
>;

export type ConsulterReprésentantLégalDependencies = {
  find: Find;
};

export const registerConsulterRepresentantLegalQuery = ({
  find,
}: ConsulterReprésentantLégalDependencies) => {
  const handler: MessageHandler<ConsulterReprésentantLégalQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const lauréat = await find<Lauréat.LauréatEntity>(
      `lauréat|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(lauréat)
      .some((lauréat) =>
        mapToReadModel({
          identifiantProjet: identifiantProjetValueType,
          représentantLégal: lauréat.représentantLégal,
        }),
      )
      .none();
  };
  mediator.register('Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal', handler);
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  représentantLégal: Lauréat.LauréatEntity['représentantLégal'];
}) => Option.Type<ConsulterReprésentantLégalReadModel>;

const mapToReadModel: MapToReadModel = ({ identifiantProjet, représentantLégal }) => {
  if (!représentantLégal) {
    return Option.none;
  }

  return {
    identifiantProjet,
    nomReprésentantLégal: représentantLégal.nom,
    typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(représentantLégal.type),
  };
};
