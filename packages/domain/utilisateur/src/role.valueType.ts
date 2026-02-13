import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { AccèsFonctionnalitéRefuséError, RoleRefuséError } from './utilisateur.error.js';
import {
  ademePolicies,
  adminPolicies,
  caisseDesDépôtsPolicies,
  cocontractantPolicies,
  crePolicies,
  dgecValidateurPolicies,
  drealPolicies,
  grdPolicies,
  porteurProjetPolicies,
} from './permissions/rôles/index.js';
import { policies, Policy } from './permissions/policies.js';

export const roles = [
  'admin',
  'porteur-projet',
  'dreal',
  'cocontractant',
  'ademe',
  'dgec-validateur',
  'caisse-des-dépôts',
  'cre',
  'grd',
] as const;
export type RawType = (typeof roles)[number];

type Message = { type: string };

export type ValueType<TRole extends RawType = RawType> = ReadonlyValueType<{
  nom: TRole;
  estÉgaleÀ(valueType: ValueType): boolean;
  peutExécuterMessage<TMessageType extends Message = Message>(
    typeMessage: TMessageType['type'],
  ): void;
  peutExécuterPlusieursMessages<TMessageType extends Message[] = Message[]>(
    typeMessages: Array<TMessageType[number]['type']>,
  ): void;
  aLaPermission(value: Policy): boolean;
  estDGEC(): boolean;
  estDreal(): boolean;
  estPorteur(): boolean;
  estGrd(): boolean;
  estCocontractant(): boolean;
  estValidateur(): boolean;
}>;

export const convertirEnValueType = <TRole extends RawType = RawType>(
  value: string,
): ValueType<TRole> => {
  estValide(value);
  return bind<TRole>({ nom: value });
};

export const bind = <TRole extends RawType = RawType>({
  nom: value,
}: PlainType<ValueType>): ValueType<TRole> => {
  estValide(value);
  return {
    nom: value as TRole,
    estÉgaleÀ(valueType: ValueType) {
      return valueType.nom === this.nom;
    },
    aLaPermission(permission) {
      const aLaPermission = policiesParRole[this.nom].includes(permission);
      return aLaPermission;
    },
    peutExécuterMessage(typeMessage) {
      const aLaPermission = droitsMessagesMediator[this.nom].has(typeMessage);

      if (!aLaPermission) {
        throw new AccèsFonctionnalitéRefuséError(typeMessage, this.nom);
      }
    },
    peutExécuterPlusieursMessages(typeMessages) {
      for (const typeMessage of typeMessages) {
        this.peutExécuterMessage(typeMessage);
      }
    },
    estDGEC() {
      return this.nom === 'admin' || this.nom === 'dgec-validateur';
    },
    estDreal() {
      return this.nom === 'dreal';
    },
    estPorteur() {
      return this.nom === 'porteur-projet';
    },
    estGrd() {
      return this.nom === 'grd';
    },
    estCocontractant() {
      return this.nom === 'cocontractant';
    },
    estValidateur() {
      return this.nom === 'dgec-validateur';
    },
  };
};

export const estUnRoleValide = (value: string) => {
  return roles.includes(value as RawType);
};

function estValide(value: string): asserts value is RawType {
  const isValid = estUnRoleValide(value);

  if (!isValid) {
    throw new RoleRefuséError(value);
  }
}

export const porteur = convertirEnValueType<'porteur-projet'>('porteur-projet');
export const admin = convertirEnValueType<'admin'>('admin');
export const ademe = convertirEnValueType<'ademe'>('ademe');
export const dgecValidateur = convertirEnValueType<'dgec-validateur'>('dgec-validateur');
export const dreal = convertirEnValueType<'dreal'>('dreal');
export const cre = convertirEnValueType<'cre'>('cre');
export const cocontractant = convertirEnValueType<'cocontractant'>('cocontractant');
export const caisseDesDépôts = convertirEnValueType<'caisse-des-dépôts'>('caisse-des-dépôts');
export const grd = convertirEnValueType<'grd'>('grd');

const policiesParRole: Record<RawType, ReadonlyArray<Policy>> = {
  admin: adminPolicies,
  cocontractant: cocontractantPolicies,
  ademe: ademePolicies,
  'caisse-des-dépôts': caisseDesDépôtsPolicies,
  cre: crePolicies,
  dreal: drealPolicies,
  'dgec-validateur': dgecValidateurPolicies,
  'porteur-projet': porteurProjetPolicies,
  grd: grdPolicies,
};

/** La liste par projet des permissions techniques (message Mediator) */
const droitsMessagesMediator: Record<RawType, Set<string>> = Object.entries(policiesParRole).reduce(
  (prev, [roleStr, policiesOfRole]) => {
    const role = roleStr as RawType;
    if (!prev[role]) {
      prev[role] = new Set<Policy>();
    }
    for (const policy of policiesOfRole) {
      const props = policy.split('.');
      const permissionsForPolicy = props.reduce(
        (result, prop) => (typeof result === 'object' && result[prop] ? result[prop] : undefined),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        policies as any,
      ) as unknown as string[];

      permissionsForPolicy.forEach((p) => prev[role].add(p));
    }

    return prev;
  },
  {} as Record<RawType, Set<string>>,
);
