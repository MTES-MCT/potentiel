import { Role } from '..';

import { Leaves, policies } from './_utils/policies';
import {
  permissionAdmin,
  permissionDgecValidateur,
  permissionDreal,
  permissionPorteurProjet,
  permissionAcheteurObligé,
  permissionCRE,
  permissionCaisseDesDépôts,
  permissionGRD,
} from './role';

export type Policy = Leaves<typeof policies>;

export const policyParRole: Record<Role.RawType, Policy[]> = {
  admin: permissionAdmin,
  'dgec-validateur': permissionDgecValidateur,
  dreal: permissionDreal,
  'porteur-projet': permissionPorteurProjet,
  'acheteur-obligé': permissionAcheteurObligé,
  cre: permissionCRE,
  ademe: [],
  'caisse-des-dépôts': permissionCaisseDesDépôts,
  grd: permissionGRD,
};

export const droitsMessagesMediator: Record<Role.RawType, Set<string>> = Object.entries(
  policyParRole,
).reduce(
  (prev, [roleStr, policiesOfRole]) => {
    const role = roleStr as Role.RawType;
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
  {} as Record<Role.RawType, Set<string>>,
);
