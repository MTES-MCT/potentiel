import { UserRole } from '../users';
import {
  PermissionConsulterProjet,
  PermissionListerProjets,
  PermissionExporterProjets,
} from '../project';
import { match, P } from 'ts-pattern';

export type Permission = {
  nom: string;
  description: string;
};

export const getPermissions = ({ role }: { role: UserRole }): Array<Permission> =>
  match(role)
    .with(
      P.union(
        'dreal',
        'porteur-projet',
        'caisse-des-dépôts',
        'admin',
        'dgec-validateur',
        'acheteur-obligé',
        'cre',
        'ademe',
      ),
      () => [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets],
    )
    .with('grd', () => [])
    .exhaustive();
