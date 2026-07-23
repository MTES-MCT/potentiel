import { type Message, type MessageHandler, mediator } from 'mediateur';

import { type List, type RangeOptions, Where, type WhereOptions } from '@potentiel-domain/entity';

import {
  type ConsulterUtilisateurReadModel,
  mapToReadModel,
} from '../consulter/consulterUtilisateur.query.js';
import { Role, Zone } from '../index.js';
import * as Région from '../région.valueType.js';
import type { UtilisateurEntity } from '../utilisateur.entity.js';

export type ListerUtilisateursReadModel = {
  items: Array<ConsulterUtilisateurReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerUtilisateursQuery = Message<
  'Utilisateur.Query.ListerUtilisateurs',
  {
    range?: RangeOptions;
    roles?: Array<string>;
    identifiantGestionnaireRéseau?: string;
    région?: string;
    zones?: Array<string>;
    zni?: boolean;
    actif?: boolean;
  } & (
    | {
        identifiantUtilisateur?: string;
        identifiantsUtilisateur?: undefined;
      }
    | {
        identifiantUtilisateur?: undefined;
        identifiantsUtilisateur: string[];
      }
  ),
  ListerUtilisateursReadModel
>;

export type ListerUtilisateursDependencies = {
  list: List;
};

export const registerListerUtilisateursQuery = ({ list }: ListerUtilisateursDependencies) => {
  const handler: MessageHandler<ListerUtilisateursQuery> = async ({
    roles,
    range,
    identifiantUtilisateur,
    identifiantsUtilisateur,
    identifiantGestionnaireRéseau,
    région,
    zones,
    zni,
    actif,
  }) => {
    const roleWhereCondition = (
      région !== undefined || zni !== undefined
        ? {
            rôle: Where.equal('dreal'),
            région: région
              ? Where.equal(Région.convertirEnValueType(région).nom)
              : zni === true
                ? Where.matchAny(Région.régionsZNI)
                : zni === false
                  ? Where.notMatchAny(Région.régionsZNI)
                  : undefined,
          }
        : identifiantGestionnaireRéseau
          ? {
              rôle: Where.equal('grd'),
              identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
            }
          : zones?.length
            ? {
                rôle: Where.equal('cocontractant'),
                zone: Where.matchAny(zones?.map((z) => Zone.convertirEnValueType(z).nom)),
              }
            : {
                rôle: roles
                  ? Where.matchAny(roles.map((role) => Role.convertirEnValueType(role).nom))
                  : undefined,
                identifiantUtilisateur: identifiantsUtilisateur
                  ? Where.matchAny(identifiantsUtilisateur)
                  : Where.like(identifiantUtilisateur),
              }
    ) as WhereOptions<UtilisateurEntity>;

    const utilisateurs = await list<UtilisateurEntity>('utilisateur', {
      where: {
        ...roleWhereCondition,
        désactivé:
          actif === true ? Where.equalNull() : actif === false ? Where.equal(true) : undefined,
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
