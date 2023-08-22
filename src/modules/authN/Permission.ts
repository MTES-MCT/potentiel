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
import { PermissionInviterDgecValidateur } from '../utilisateur';
import { PermissionListerDemandesAdmin } from '../modificationRequest';
import { PermissionListerProjetsÀNotifier } from '../notificationCandidats';
import {
  PermissionAjouterGestionnaireRéseau,
  PermissionModifierGestionnaireRéseau,
  PermissionTransmettreDemandeComplèteRaccordement,
  PermissionTransmettreDateMiseEnService,
  PermissionTransmettrePropositionTechniqueEtFinancière,
  PermissionModifierGestionnaireRéseauProjet,
  PermissionConsulterGarantiesFinancières,
  PermissionEnregistrerGarantiesFinancières,
  PermissionDéposerGarantiesFinancières,
  PermissionValiderDépôtGarantiesFinancières,
  PermissionSupprimerDépôtGarantiesFinancières,
  PermissionConsulterListeGarantiesFinancières,
} from '@potentiel/domain';
import {
  PermissionListerGestionnairesRéseau,
  PermissionConsulterGestionnaireRéseau,
  PermissionConsulterDossierRaccordement,
} from '@potentiel/domain-views';

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
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
        PermissionValiderDépôtGarantiesFinancières,
        PermissionConsulterListeGarantiesFinancières,
      ];
    case 'porteur-projet':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionAnnulerGF,
        PermissionAjouterDateExpirationGF,
        PermissionRetirerGF,
        PermissionExporterProjets,
        PermissionTransmettreDemandeComplèteRaccordement,
        PermissionConsulterDossierRaccordement,
        PermissionTransmettrePropositionTechniqueEtFinancière,
        PermissionModifierGestionnaireRéseauProjet,
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
        PermissionDéposerGarantiesFinancières,
        PermissionSupprimerDépôtGarantiesFinancières,
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
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
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
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
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
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
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
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
      ];
    case 'ademe':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    default:
      return [];
  }
};
