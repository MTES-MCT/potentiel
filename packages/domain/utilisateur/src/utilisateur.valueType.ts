import { match } from 'ts-pattern';

import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import { Région, Zone } from '.';

import * as Role from './role.valueType';
import {
  FonctionManquanteError,
  IdentifiantGestionnaireRéseauManquantError,
  NomCompletManquantError,
  ZoneManquanteError,
} from './utilisateur.error';

type CommonValueType = {
  identifiantUtilisateur: Email.ValueType;
};
type DgecValidateurValueType = CommonValueType & {
  role: typeof Role.dgecValidateur;
  nomComplet: string;
  fonction: string;
};
type DrealValueType = CommonValueType & {
  role: typeof Role.dreal;
  région: Région.ValueType;
};
type GrdValueType = CommonValueType & {
  role: typeof Role.grd;
  identifiantGestionnaireRéseau: string;
};
type CocontractantValueType = CommonValueType & {
  role: typeof Role.cocontractant;
  zone: Zone.ValueType;
};

type AutresRolesValueType = CommonValueType & {
  role:
    | typeof Role.ademe
    | typeof Role.admin
    | typeof Role.caisseDesDépôts
    | typeof Role.cre
    | typeof Role.porteur;
};

export type RolePorteurPayload = {
  rôle: 'porteur-projet';
};
export type RôleGlobalPayload = {
  rôle: 'admin' | 'ademe' | 'caisse-des-dépôts' | 'cre';
};

export type RôleDgecValidateurPayload = {
  rôle: 'dgec-validateur';
  fonction: string;
  nomComplet: string;
};

export type RôleDrealPayload = {
  rôle: 'dreal';
  région: Région.RawType;
};

export type RôleGrdPayload = {
  rôle: 'grd';
  identifiantGestionnaireRéseau: string;
};

export type RôleCocontractantPayload = {
  rôle: 'cocontractant';
  zone: Zone.RawType;
};

export type SpécificitésRolePayload =
  | RôleGlobalPayload
  | RôleDgecValidateurPayload
  | RôleDrealPayload
  | RôleGrdPayload
  | RôleCocontractantPayload;

export type RawType =
  | ({
      identifiantUtilisateur: Email.RawType;
    } & SpécificitésRolePayload)
  | RolePorteurPayload;

export type ValueType<TRole extends Role.RawType = Role.RawType> = ReadonlyValueType<
  (
    | (TRole extends DgecValidateurValueType['role']['nom'] ? DgecValidateurValueType : never)
    | (TRole extends DrealValueType['role']['nom'] ? DrealValueType : never)
    | (TRole extends GrdValueType['role']['nom'] ? GrdValueType : never)
    | (TRole extends CocontractantValueType['role']['nom'] ? CocontractantValueType : never)
    | (TRole extends AutresRolesValueType['role']['nom'] ? AutresRolesValueType : never)
  ) & {
    estÉgaleÀ(valueType: ValueType): boolean;
    estDGEC(): this is ValueType<'admin' | 'dgec-validateur'>;
    estValidateur(): this is ValueType<'dgec-validateur'>;
    estDreal(): this is ValueType<'dreal'>;
    estCocontractant(): this is ValueType<'cocontractant'>;
    estPorteur(): this is ValueType<'porteur-projet'>;
    estGrd(): this is ValueType<'grd'>;
    formatter(): RawType;
  }
>;

export const bind = (plain: PlainType<ValueType>): ValueType => {
  const identifiantUtilisateur = Email.bind(plain.identifiantUtilisateur);

  const estÉgaleÀ = (value1: ValueType, value2: ValueType): boolean => {
    return (
      value1.identifiantUtilisateur.estÉgaleÀ(value2.identifiantUtilisateur) &&
      value1.role.estÉgaleÀ(value2.role)
    );
  };

  const common = <TRole extends Role.RawType>(role: Role.ValueType<TRole>) => ({
    role,
    identifiantUtilisateur,
    estDGEC(): this is ValueType<'admin' | 'dgec-validateur'> {
      return this.role.estDGEC();
    },
    estDreal(): this is ValueType<'dreal'> {
      return this.role.estDreal();
    },
    estPorteur(): this is ValueType<'porteur-projet'> {
      return this.role.estPorteur();
    },
    estGrd(): this is ValueType<'grd'> {
      return this.role.estGrd();
    },
    estCocontractant(): this is ValueType<'cocontractant'> {
      return this.role.estCocontractant();
    },
    estValidateur(): this is ValueType<'dgec-validateur'> {
      return this.role.estValidateur();
    },
    estÉgaleÀ(other: ValueType<TRole>) {
      return estÉgaleÀ(this as ValueType, other);
    },
    formatter() {
      return {
        rôle: role.nom,
        identifiantUtilisateur: identifiantUtilisateur.formatter(),
      };
    },
  });
  return match(plain)
    .returnType<ValueType>()
    .with({ role: { nom: 'ademe' } }, (): ValueType<'ademe'> => common(Role.ademe))
    .with({ role: { nom: 'admin' } }, (): ValueType<'admin'> => common(Role.admin))
    .with(
      { role: { nom: 'caisse-des-dépôts' } },
      (): ValueType<'caisse-des-dépôts'> => common(Role.caisseDesDépôts),
    )
    .with({ role: { nom: 'cre' } }, (): ValueType<'cre'> => common(Role.cre))
    .with(
      { role: { nom: 'porteur-projet' } },
      (): ValueType<'porteur-projet'> => common(Role.porteur),
    )
    .with(
      { role: { nom: 'grd' } },
      ({ identifiantGestionnaireRéseau }): ValueType<'grd'> => ({
        ...common(Role.grd),
        identifiantGestionnaireRéseau,
        estÉgaleÀ(other: ValueType) {
          return (
            estÉgaleÀ(this, other) &&
            other.estGrd() &&
            other.identifiantGestionnaireRéseau === identifiantGestionnaireRéseau
          );
        },
        formatter() {
          return {
            rôle: 'grd',
            identifiantUtilisateur: identifiantUtilisateur.formatter(),
            identifiantGestionnaireRéseau,
          };
        },
      }),
    )
    .with(
      { role: { nom: 'dreal' } },
      ({ région }): ValueType<'dreal'> => ({
        ...common(Role.dreal),
        région: Région.bind(région),
        estÉgaleÀ(other: ValueType) {
          return estÉgaleÀ(this, other) && other.estDreal() && other.région === région;
        },
        formatter() {
          return {
            rôle: 'dreal',
            identifiantUtilisateur: identifiantUtilisateur.formatter(),
            région: région.nom,
          };
        },
      }),
    )
    .with(
      { role: { nom: 'cocontractant' } },
      ({ zone }): ValueType<'cocontractant'> => ({
        ...common(Role.cocontractant),
        zone: Zone.bind(zone),
        estÉgaleÀ(other) {
          return estÉgaleÀ(this, other) && other.estCocontractant() && other.zone === zone;
        },
        formatter() {
          return {
            rôle: 'cocontractant',
            identifiantUtilisateur: identifiantUtilisateur.formatter(),
            zone: zone.nom,
          };
        },
      }),
    )
    .with(
      { role: { nom: 'dgec-validateur' } },
      ({ nomComplet, fonction }): ValueType<'dgec-validateur'> => ({
        ...common(Role.dgecValidateur),
        nomComplet,
        fonction,
        estÉgaleÀ(other) {
          return (
            estÉgaleÀ(this, other) &&
            other.estValidateur() &&
            other.nomComplet === nomComplet &&
            other.fonction === fonction
          );
        },
        formatter() {
          return {
            rôle: 'dgec-validateur',
            identifiantUtilisateur: identifiantUtilisateur.formatter(),
            fonction,
            nomComplet,
          };
        },
      }),
    )
    .exhaustive();
};

type ConvertirEnValueTypeProps = {
  identifiantUtilisateur: string;
  role: string;
  région?: string;
  identifiantGestionnaireRéseau?: string;
  zone?: string;
  nomComplet?: string;
  fonction?: string;
};

export const convertirEnValueType = ({
  identifiantUtilisateur: identifiantUtilisateurValue,
  role: roleValue,
  région,
  identifiantGestionnaireRéseau,
  zone,
  nomComplet,
  fonction,
}: ConvertirEnValueTypeProps) => {
  const rôle = Role.convertirEnValueType(roleValue);
  const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
  return match(rôle)
    .returnType<ValueType>()
    .with({ nom: 'ademe' }, () => bind({ role: Role.ademe, identifiantUtilisateur }))
    .with({ nom: 'admin' }, () => bind({ role: Role.admin, identifiantUtilisateur }))
    .with({ nom: 'caisse-des-dépôts' }, () =>
      bind({ role: Role.caisseDesDépôts, identifiantUtilisateur }),
    )
    .with({ nom: 'cre' }, () => bind({ role: Role.cre, identifiantUtilisateur }))
    .with({ nom: 'porteur-projet' }, () => bind({ role: Role.porteur, identifiantUtilisateur }))
    .with({ nom: 'dgec-validateur' }, (role) => {
      if (!fonction) {
        throw new FonctionManquanteError();
      }
      if (!nomComplet) {
        throw new NomCompletManquantError();
      }
      return bind({
        identifiantUtilisateur,
        role,
        nomComplet,
        fonction,
      });
    })
    .with({ nom: 'grd' }, (role) => {
      if (!identifiantGestionnaireRéseau) {
        throw new IdentifiantGestionnaireRéseauManquantError();
      }
      return bind({ identifiantUtilisateur, role, identifiantGestionnaireRéseau });
    })
    .with({ nom: 'dreal' }, (role) => {
      if (!région) {
        throw new IdentifiantGestionnaireRéseauManquantError();
      }
      return bind({ identifiantUtilisateur, role, région: Région.convertirEnValueType(région) });
    })
    .with({ nom: 'cocontractant' }, (role) => {
      if (!zone) {
        throw new ZoneManquanteError();
      }
      return bind({ identifiantUtilisateur, role, zone: Zone.convertirEnValueType(zone) });
    })
    .exhaustive();
};
