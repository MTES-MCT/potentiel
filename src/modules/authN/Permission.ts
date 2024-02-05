import { UserRole } from '../users';
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
} from '../project';
import { PermissionInviterDgecValidateur, PermissionInviterAdministrateur } from '../utilisateur';
import { PermissionListerDemandesAdmin } from '../modificationRequest';
import { PermissionListerProjetsÀNotifier } from '../notificationCandidats';
import {
  PermissionAjouterGestionnaireRéseau,
  PermissionModifierGestionnaireRéseau,
  PermissionTransmettreDateMiseEnService,
  PermissionTransmettrePropositionTechniqueEtFinancière,
  PermissionModifierGestionnaireRéseauProjet,
  PermissionListerGestionnairesRéseau,
  PermissionConsulterGestionnaireRéseau,
  PermissionConsulterDossierRaccordement,
  PermissionListerAbandons,
} from '@potentiel/legacy-permissions';

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
        PermissionConsulterDossierRaccordement,
        PermissionListerAbandons,
      ];
    case 'porteur-projet':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionAnnulerGF,
        PermissionRetirerGF,
        PermissionExporterProjets,
        PermissionConsulterDossierRaccordement,
        PermissionTransmettrePropositionTechniqueEtFinancière,
        PermissionModifierGestionnaireRéseauProjet,
        PermissionUploaderGF,
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
        PermissionInviterAdministrateur,
        PermissionExporterProjets,
        PermissionListerProjetsÀNotifier,
        PermissionListerGestionnairesRéseau,
        PermissionConsulterGestionnaireRéseau,
        PermissionAjouterGestionnaireRéseau,
        PermissionModifierGestionnaireRéseau,
        PermissionConsulterDossierRaccordement,
        PermissionTransmettreDateMiseEnService,
        PermissionTransmettrePropositionTechniqueEtFinancière,
        PermissionModifierGestionnaireRéseauProjet,
        PermissionListerAbandons,
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
        PermissionInviterAdministrateur,
        PermissionListerGestionnairesRéseau,
        PermissionConsulterGestionnaireRéseau,
        PermissionAjouterGestionnaireRéseau,
        PermissionModifierGestionnaireRéseau,
        PermissionConsulterDossierRaccordement,
        PermissionTransmettreDateMiseEnService,
        PermissionTransmettrePropositionTechniqueEtFinancière,
        PermissionModifierGestionnaireRéseauProjet,
        PermissionListerAbandons,
      ];
    case 'acheteur-obligé':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionExporterProjets,
        PermissionConsulterDossierRaccordement,
      ];
    case 'cre':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionExporterProjets,
        PermissionConsulterDossierRaccordement,
        PermissionUploaderGF,
      ];
    case 'ademe':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    default:
      return [];
  }
};
