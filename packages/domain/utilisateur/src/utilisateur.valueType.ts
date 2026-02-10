import { match } from 'ts-pattern';

import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import { Région, Zone } from './index.js';

import * as Role from './role.valueType.js';
import {
  FonctionManquanteError,
  IdentifiantGestionnaireRéseauManquantError,
  NomCompletManquantError,
  RégionManquanteError,
  ZoneManquanteError,
} from './utilisateur.error.js';

type CommonValueType = {
  identifiantUtilisateur: Email.ValueType;
};
type DgecValidateurValueType = CommonValueType & {
  rôle: typeof Role.dgecValidateur;
  nomComplet: string;
  fonction: string;
};
type DrealValueType = CommonValueType & {
  rôle: typeof Role.dreal;
  région: Région.ValueType;
};
type GrdValueType = CommonValueType & {
  rôle: typeof Role.grd;
  identifiantGestionnaireRéseau: string;
};
type CocontractantValueType = CommonValueType & {
  rôle: typeof Role.cocontractant;
  zone: Zone.ValueType;
};

type AutresRolesValueType = CommonValueType & {
  rôle:
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
    | (TRole extends DgecValidateurValueType['rôle']['nom'] ? DgecValidateurValueType : never)
    | (TRole extends DrealValueType['rôle']['nom'] ? DrealValueType : never)
    | (TRole extends GrdValueType['rôle']['nom'] ? GrdValueType : never)
    | (TRole extends CocontractantValueType['rôle']['nom'] ? CocontractantValueType : never)
    | (TRole extends AutresRolesValueType['rôle']['nom'] ? AutresRolesValueType : never)
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
      value1.rôle.estÉgaleÀ(value2.rôle)
    );
  };

  const common = <TRole extends Role.RawType>(rôle: Role.ValueType<TRole>) => ({
    rôle,
    identifiantUtilisateur,
    estDGEC(): this is ValueType<'admin' | 'dgec-validateur'> {
      return this.rôle.estDGEC();
    },
    estDreal(): this is ValueType<'dreal'> {
      return this.rôle.estDreal();
    },
    estPorteur(): this is ValueType<'porteur-projet'> {
      return this.rôle.estPorteur();
    },
    estGrd(): this is ValueType<'grd'> {
      return this.rôle.estGrd();
    },
    estCocontractant(): this is ValueType<'cocontractant'> {
      return this.rôle.estCocontractant();
    },
    estValidateur(): this is ValueType<'dgec-validateur'> {
      return this.rôle.estValidateur();
    },
    estÉgaleÀ(other: ValueType<TRole>) {
      return estÉgaleÀ(this as ValueType, other);
    },
    formatter() {
      return {
        rôle: this.rôle.nom,
        identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
      };
    },
  });
  return match(plain)
    .returnType<ValueType>()
    .with({ rôle: { nom: 'ademe' } }, (): ValueType<'ademe'> => common(Role.ademe))
    .with({ rôle: { nom: 'admin' } }, (): ValueType<'admin'> => common(Role.admin))
    .with(
      { rôle: { nom: 'caisse-des-dépôts' } },
      (): ValueType<'caisse-des-dépôts'> => common(Role.caisseDesDépôts),
    )
    .with({ rôle: { nom: 'cre' } }, (): ValueType<'cre'> => common(Role.cre))
    .with(
      { rôle: { nom: 'porteur-projet' } },
      (): ValueType<'porteur-projet'> => common(Role.porteur),
    )
    .with(
      { rôle: { nom: 'grd' } },
      ({ identifiantGestionnaireRéseau }): ValueType<'grd'> => ({
        ...common(Role.grd),
        identifiantGestionnaireRéseau,
        estÉgaleÀ(other: ValueType) {
          return (
            estÉgaleÀ(this, other) &&
            other.estGrd() &&
            other.identifiantGestionnaireRéseau === this.identifiantGestionnaireRéseau
          );
        },
        formatter() {
          return {
            rôle: this.rôle.nom,
            identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
            identifiantGestionnaireRéseau: this.identifiantGestionnaireRéseau,
          };
        },
      }),
    )
    .with(
      { rôle: { nom: 'dreal' } },
      ({ région }): ValueType<'dreal'> => ({
        ...common(Role.dreal),
        région: Région.bind(région),
        estÉgaleÀ(other: ValueType) {
          return estÉgaleÀ(this, other) && other.estDreal() && other.région.estÉgaleÀ(this.région);
        },
        formatter() {
          return {
            rôle: this.rôle.nom,
            identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
            région: this.région.formatter(),
          };
        },
      }),
    )
    .with(
      { rôle: { nom: 'cocontractant' } },
      ({ zone }): ValueType<'cocontractant'> => ({
        ...common(Role.cocontractant),
        zone: Zone.bind(zone),
        estÉgaleÀ(other) {
          return (
            estÉgaleÀ(this, other) && other.estCocontractant() && other.zone.estÉgaleÀ(this.zone)
          );
        },
        formatter() {
          return {
            rôle: this.rôle.nom,
            identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
            zone: this.zone.nom,
          };
        },
      }),
    )
    .with(
      { rôle: { nom: 'dgec-validateur' } },
      ({ nomComplet, fonction }): ValueType<'dgec-validateur'> => ({
        ...common(Role.dgecValidateur),
        nomComplet,
        fonction,
        estÉgaleÀ(other) {
          return (
            estÉgaleÀ(this, other) &&
            other.estValidateur() &&
            other.nomComplet === this.nomComplet &&
            other.fonction === this.fonction
          );
        },
        formatter() {
          return {
            rôle: this.rôle.nom,
            identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
            fonction: this.fonction,
            nomComplet: this.nomComplet,
          };
        },
      }),
    )
    .exhaustive();
};

type ConvertirEnValueTypeProps = {
  identifiantUtilisateur: string;
  rôle: string;
  région?: string;
  identifiantGestionnaireRéseau?: string;
  zone?: string;
  nomComplet?: string;
  fonction?: string;
};

export const convertirEnValueType = ({
  identifiantUtilisateur: identifiantUtilisateurValue,
  rôle: roleValue,
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
    .with({ nom: 'ademe' }, () => bind({ rôle: Role.ademe, identifiantUtilisateur }))
    .with({ nom: 'admin' }, () => bind({ rôle: Role.admin, identifiantUtilisateur }))
    .with({ nom: 'caisse-des-dépôts' }, () =>
      bind({ rôle: Role.caisseDesDépôts, identifiantUtilisateur }),
    )
    .with({ nom: 'cre' }, () => bind({ rôle: Role.cre, identifiantUtilisateur }))
    .with({ nom: 'porteur-projet' }, () => bind({ rôle: Role.porteur, identifiantUtilisateur }))
    .with({ nom: 'dgec-validateur' }, (rôle) => {
      if (!fonction) {
        throw new FonctionManquanteError();
      }
      if (!nomComplet) {
        throw new NomCompletManquantError();
      }
      return bind({
        identifiantUtilisateur,
        rôle,
        nomComplet,
        fonction,
      });
    })
    .with({ nom: 'grd' }, (rôle) => {
      if (!identifiantGestionnaireRéseau) {
        throw new IdentifiantGestionnaireRéseauManquantError();
      }
      return bind({ identifiantUtilisateur, rôle, identifiantGestionnaireRéseau });
    })
    .with({ nom: 'dreal' }, (rôle) => {
      if (!région) {
        throw new RégionManquanteError();
      }
      return bind({ identifiantUtilisateur, rôle, région: Région.convertirEnValueType(région) });
    })
    .with({ nom: 'cocontractant' }, (rôle) => {
      if (!zone) {
        throw new ZoneManquanteError();
      }
      return bind({ identifiantUtilisateur, rôle, zone: Zone.convertirEnValueType(zone) });
    })
    .exhaustive();
};
