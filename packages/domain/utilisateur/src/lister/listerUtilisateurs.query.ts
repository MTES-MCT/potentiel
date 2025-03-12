import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { UtilisateurEntity } from '../utilisateur.entity';
import {
  ConsulterUtilisateurReadModel,
  mapToReadModel,
} from '../consulter/consulterUtilisateur.query';
import { Role } from '..';

export type ListerUtilisateursReadModel = {
  items: Array<ConsulterUtilisateurReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerUtilisateursQuery = Message<
  'Utilisateur.Query.ListerUtilisateurs',
  {
    roles?: Array<string>;
    identifiantUtilisateur?: string;
    range?: RangeOptions;
  },
  ListerUtilisateursReadModel
>;

export type ListerUtilisateursPort = (
  roles?: Array<string>,
) => Promise<ReadonlyArray<UtilisateurEntity>>;

export type ListerUtilisateursDependencies = {
  list: List;
};

export const registerListerUtilisateursQuery = ({ list }: ListerUtilisateursDependencies) => {
  const handler: MessageHandler<ListerUtilisateursQuery> = async ({
    roles,
    range,
    identifiantUtilisateur,
  }) => {
    const utilisateurs = await list<UtilisateurEntity>('utilisateur', {
      where: {
        rôle: roles
          ? Where.matchAny(roles.map((role) => Role.convertirEnValueType(role).nom))
          : undefined,
        identifiantUtilisateur: Where.contain(identifiantUtilisateur),
      },
      orderBy: {
        invitéLe: 'descending',
      },
      range,
    });

    return {
      items: utilisateurs.items.map(mapToReadModel),
      range: utilisateurs.range,
      total: utilisateurs.total,
    };
  };

  mediator.register('Utilisateur.Query.ListerUtilisateurs', handler);
};
