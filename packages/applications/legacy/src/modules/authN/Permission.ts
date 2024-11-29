import { UserRole } from '../users';
import {
  PermissionConsulterProjet,
  PermissionListerProjets,
  PermissionExporterProjets,
} from '../project';
import { PermissionListerDemandesAdmin } from '../modificationRequest';

export type Permission = {
  nom: string;
  description: string;
};

export const getPermissions = ({ role }: { role: UserRole }): Array<Permission> => {
  switch (role) {
    case 'dreal':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionListerDemandesAdmin,
        PermissionExporterProjets,
      ];
    case 'porteur-projet':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    case 'caisse-des-dépôts':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    case 'admin':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
        PermissionExporterProjets,
      ];
    case 'dgec-validateur':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
        PermissionExporterProjets,
      ];
    case 'acheteur-obligé':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    case 'cre':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    case 'ademe':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    default:
      return [];
  }
};
