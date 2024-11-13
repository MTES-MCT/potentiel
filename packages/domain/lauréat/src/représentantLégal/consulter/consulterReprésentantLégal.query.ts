import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { ReprésentantLégalEntity } from '../représentantLégal.entity';

export type ConsulterReprésentantLégalReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomReprésentantLégal: string;
  import: {
    importéPar: Email.ValueType;
    importéLe: DateTime.ValueType;
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
    const result = await find<ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(result).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal', handler);
};

const mapToReadModel = (result: ReprésentantLégalEntity) =>
  ({
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    nomReprésentantLégal: result.nomReprésentantLégal,
    import: {
      importéLe: DateTime.convertirEnValueType(result.import.importéLe),
      importéPar: Email.convertirEnValueType(result.import.importéPar),
    },
  }) satisfies ConsulterReprésentantLégalReadModel;
