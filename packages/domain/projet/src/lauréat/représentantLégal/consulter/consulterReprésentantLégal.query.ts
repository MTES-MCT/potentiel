import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { ReprésentantLégalEntity, TypeReprésentantLégal } from '../index.js';
import { IdentifiantProjet } from '../../../index.js';

export type ConsulterReprésentantLégalReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  demandeEnCours?: {
    demandéLe: string;
  };
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

    const représentantLégal = await find<ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(représentantLégal)
      .some((représentantLégal) =>
        mapToReadModel({
          identifiantProjet: identifiantProjetValueType,
          représentantLégal,
        }),
      )
      .none();
  };
  mediator.register('Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal', handler);
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  représentantLégal: ReprésentantLégalEntity;
}) => Option.Type<ConsulterReprésentantLégalReadModel>;

const mapToReadModel: MapToReadModel = ({ identifiantProjet, représentantLégal }) => ({
  identifiantProjet,
  nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
  typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
    représentantLégal.typeReprésentantLégal,
  ),
  demandeEnCours: représentantLégal.demandeEnCours,
});
