import { UserRole } from '@modules/users';
import {
  PermissionConsulterProjet,
  PermissionInvaliderGF,
  PermissionValiderGF,
  PermissionAnnulerGF,
  PermissionAjouterDateExpirationGF,
  PermissionUploaderGF,
  PermissionRetirerGF,
  PermissionListerProjets,
  PermissionExporterProjets,
  PermissionModifierIdentifiantGestionnaireReseau,
} from '@modules/project';
import { PermissionInviterDgecValidateur } from '@modules/utilisateur';
import { PermissionListerDemandesAdmin } from '@modules/modificationRequest';
import { PermissionListerProjetsÀNotifier } from '@modules/notificationCandidats';
import { PermissionListerGestionnairesRéseau } from '@modules/gestionnaireRéseau/lister/ListerGestionnairesRéseau';

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
        PermissionValiderGF,
        PermissionInvaliderGF,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionListerDemandesAdmin,
        PermissionExporterProjets,
      ];
    case 'porteur-projet':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionAnnulerGF,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionExporterProjets,
        PermissionModifierIdentifiantGestionnaireReseau,
      ];
    case 'caisse-des-dépôts':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionAnnulerGF,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionExporterProjets,
      ];
    case 'admin':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionInviterDgecValidateur,
        PermissionExporterProjets,
        PermissionListerProjetsÀNotifier,
        PermissionModifierIdentifiantGestionnaireReseau,
        PermissionListerGestionnairesRéseau,
      ];
    case 'dgec-validateur':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionExporterProjets,
        PermissionListerProjetsÀNotifier,
        PermissionModifierIdentifiantGestionnaireReseau,
        PermissionListerGestionnairesRéseau,
      ];
    case 'acheteur-obligé':
    case 'ademe':
    case 'cre':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    default:
      return [];
  }
};
