import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where, WhereOptions } from '@potentiel-domain/entity';

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
    range?: RangeOptions;
    identifiantUtilisateur?: string;
    roles?: Array<string>;
    identifiantGestionnaireRéseau?: string;
    région?: string;
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
    identifiantGestionnaireRéseau,
    région,
  }) => {
    const where: WhereOptions<UtilisateurEntity> = région
      ? {
          rôle: Where.equal('dreal'),
          région: Where.equal(région),
        }
      : identifiantGestionnaireRéseau
        ? {
            rôle: Where.equal('dreal'),
            identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
          }
        : {
            rôle: (roles
              ? Where.matchAny(roles.map((role) => Role.convertirEnValueType(role).nom))
              : // Typescript is lost with the union type :/
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                undefined) as any,
            identifiantUtilisateur: Where.contain(identifiantUtilisateur),
          };
    const utilisateurs = await list<UtilisateurEntity>('utilisateur', {
      where,
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
