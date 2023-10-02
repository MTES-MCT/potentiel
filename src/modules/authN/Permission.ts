import { UserRole } from '../users';
import {
  PermissionConsulterProjet,
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
  PermissionConsulterListeDépôts,
  PermissionModifierDépôtGarantiesFinancières,
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
        PermissionListerDemandesAdmin,
        PermissionExporterProjets,
        PermissionConsulterDossierRaccordement,
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
        PermissionValiderDépôtGarantiesFinancières,
        PermissionConsulterListeDépôts,
        PermissionModifierDépôtGarantiesFinancières,
      ];
    case 'porteur-projet':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionExporterProjets,
        PermissionTransmettreDemandeComplèteRaccordement,
        PermissionConsulterDossierRaccordement,
        PermissionTransmettrePropositionTechniqueEtFinancière,
        PermissionModifierGestionnaireRéseauProjet,
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
        PermissionDéposerGarantiesFinancières,
        PermissionSupprimerDépôtGarantiesFinancières,
        PermissionModifierDépôtGarantiesFinancières,
      ];
    case 'caisse-des-dépôts':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionExporterProjets,
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
      ];
    case 'admin':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
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
        PermissionModifierDépôtGarantiesFinancières,
      ];
    case 'dgec-validateur':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
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
        PermissionConsulterGarantiesFinancières,
        PermissionEnregistrerGarantiesFinancières,
      ];
    case 'ademe':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets];
    default:
      return [];
  }
};
