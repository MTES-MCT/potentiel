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
} from '@modules/project';
import { PermissionInviterDgecValidateur } from '@modules/utilisateur';
import { PermissionListerDemandesAdmin } from '@modules/modificationRequest';
import { PermissionListerProjetsÀNotifier } from '@modules/notificationCandidats';
import {
  PermissionListerGestionnairesRéseau,
  PermissionConsulterGestionnaireRéseau,
  PermissionAjouterGestionnaireRéseau,
  PermissionModifierGestionnaireRéseau,
  PermissionTransmettreDemandeComplèteRaccordement,
  PermissionConsulterDossierRaccordement,
  PermissionTransmettreDateMiseEnService,
  PermissionTransmettrePropositionTechniqueEtFinancière,
  PermissionModifierGestionnaireRéseauProjet,
} from '@potentiel/domain';

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
        PermissionTransmettreDemandeComplèteRaccordement,
        PermissionConsulterDossierRaccordement,
        PermissionTransmettrePropositionTechniqueEtFinancière,
        PermissionModifierGestionnaireRéseauProjet,
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
        PermissionListerGestionnairesRéseau,
        PermissionConsulterGestionnaireRéseau,
        PermissionAjouterGestionnaireRéseau,
        PermissionModifierGestionnaireRéseau,
        PermissionTransmettreDemandeComplèteRaccordement,
        PermissionConsulterDossierRaccordement,
        PermissionTransmettreDateMiseEnService,
        PermissionTransmettrePropositionTechniqueEtFinancière,
        PermissionModifierGestionnaireRéseauProjet,
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
        PermissionListerGestionnairesRéseau,
        PermissionConsulterGestionnaireRéseau,
        PermissionAjouterGestionnaireRéseau,
        PermissionModifierGestionnaireRéseau,
        PermissionTransmettreDemandeComplèteRaccordement,
        PermissionConsulterDossierRaccordement,
        PermissionTransmettreDateMiseEnService,
        PermissionTransmettrePropositionTechniqueEtFinancière,
        PermissionModifierGestionnaireRéseauProjet,
      ];
    case 'acheteur-obligé':
    case 'cre':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionExporterProjets,
        PermissionConsulterDossierRaccordement,
      ];
    case 'ademe':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    default:
      return [];
  }
};
