import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../index.js';
import { AccèsEntity } from '../accès.entity.js';

export type ConsulterAccèsReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateursAyantAccès: Array<Email.ValueType>;
};

export type ConsulterAccèsQuery = Message<
  'Projet.Accès.Query.ConsulterAccès',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterAccèsReadModel>
>;

export type ConsulterAccèsDependencies = {
  find: Find;
};

export const registerConsulterAccèsQuery = ({ find }: ConsulterAccèsDependencies) => {
  const handler: MessageHandler<ConsulterAccèsQuery> = async ({ identifiantProjet }) => {
    const accès = await find<AccèsEntity>(`accès|${identifiantProjet}`);

    if (Option.isNone(accès)) {
      return accès;
    }

    return mapToReadModel(accès);
  };

  mediator.register('Projet.Accès.Query.ConsulterAccès', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  utilisateursAyantAccès,
}: AccèsEntity): ConsulterAccèsReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    utilisateursAyantAccès: utilisateursAyantAccès.map((identifiantUtilisateur) =>
      Email.convertirEnValueType(identifiantUtilisateur),
    ),
  };
};
