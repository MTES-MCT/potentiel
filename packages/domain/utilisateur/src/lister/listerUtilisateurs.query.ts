import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where, WhereOptions } from '@potentiel-domain/entity';

import { UtilisateurEntity } from '../utilisateur.entity';
import {
  ConsulterUtilisateurReadModel,
  mapToReadModel,
} from '../consulter/consulterUtilisateur.query';
import { Role, Zone } from '..';
import * as Région from '../région.valueType';

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
    zone?: string;
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
    zone,
    zni,
    actif,
  }) => {
    const roleWhereCondition: WhereOptions<UtilisateurEntity> =
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
          : zone
            ? {
                rôle: Where.equal('cocontractant'),
                zone: Where.equal(Zone.convertirEnValueType(zone).nom),
              }
            : {
                rôle: (roles
                  ? Where.matchAny(roles.map((role) => Role.convertirEnValueType(role).nom))
                  : // Typescript is lost with the union type :/
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    undefined) as any,
                identifiantUtilisateur: identifiantsUtilisateur
                  ? Where.matchAny(identifiantsUtilisateur)
                  : Where.contain(identifiantUtilisateur),
              };

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
