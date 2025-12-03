import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { AccèsFonctionnalitéRefuséError, RoleRefuséError } from './utilisateur.error';

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

// MATRICE en mémoire en attendant de pouvoir gérer les permissions depuis une interface d'administration
/**
 * Mapping entre les droits fonctionnels et le type de message mediator
 */
const référencielPermissions = {
  lauréat: {
    abandon: {
      query: {
        consulter: 'Lauréat.Abandon.Query.ConsulterAbandon',
        lister: 'Lauréat.Abandon.Query.ListerAbandons',
        listerHistoriqueAbandon: 'Lauréat.Abandon.Query.ListerHistoriqueAbandonProjet',
      },
      usecase: {
        annuler: 'Lauréat.Abandon.UseCase.AnnulerAbandon',
        confirmer: 'Lauréat.Abandon.UseCase.ConfirmerAbandon',
        demander: 'Lauréat.Abandon.UseCase.DemanderAbandon',
        transmettrePreuveRecandidature:
          'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
        accorder: 'Lauréat.Abandon.UseCase.AccorderAbandon',
        demanderConfirmation: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
        rejeter: 'Lauréat.Abandon.UseCase.RejeterAbandon',
        passerEnInstruction: 'Lauréat.Abandon.UseCase.PasserAbandonEnInstruction',
      },
      command: {
        annuler: 'Lauréat.Abandon.Command.AnnulerAbandon',
        confirmer: 'Lauréat.Abandon.Command.ConfirmerAbandon',
        demander: 'Lauréat.Abandon.Command.DemanderAbandon',
        transmettrePreuveRecandidature:
          'Lauréat.Abandon.Command.TransmettrePreuveRecandidatureAbandon',
        accorder: 'Lauréat.Abandon.Command.AccorderAbandon',
        demanderConfirmation: 'Lauréat.Abandon.Command.DemanderConfirmationAbandon',
        rejeter: 'Lauréat.Abandon.Command.RejeterAbandon',
        passerEnInstruction: 'Lauréat.Abandon.Command.PasserAbandonEnInstruction',
      },
    },
    raccordement: {
      query: {
        consulter: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        consulterDossier: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
        consulterGestionnaireRéseau:
          'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
        consulterNombre: 'Lauréat.Raccordement.Query.ConsulterNombreDeRaccordement',
        rechercher: 'Lauréat.Raccordement.Query.RechercherDossierRaccordement',
        lister: 'Lauréat.Raccordement.Query.ListerRaccordement',
        listerDossierRaccordementEnAttenteMiseEnService:
          'Lauréat.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
        listerDossierRaccordement: 'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
        listerDossierRaccordementManquants:
          'Lauréat.Raccordement.Query.ListerDossierRaccordementManquantsQuery',
        listerHistoriqueRaccordement:
          'Lauréat.Raccordement.Query.ListerHistoriqueRaccordementProjet',
      },
      usecase: {
        modifierDemandeComplète: 'Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
        modifierGestionnaireRéseau:
          'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
        modifierPropostionTechniqueEtFinancière:
          'Lauréat.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
        modifierRéférenceDossier:
          'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
        transmettreDateMiseEnService: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
        transmettreDemandeComplète:
          'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
        transmettrePropositionTechniqueEtFinancière:
          'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
        supprimerDossierDuRaccordement:
          'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
      },
      command: {
        modifierDemandeComplète: 'Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement',
        modifierGestionnaireRéseau:
          'Lauréat.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
        modifierPropostionTechniqueEtFinancière:
          'Lauréat.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
        modifierRéférenceDossier:
          'Lauréat.Raccordement.Command.ModifierRéférenceDossierRaccordement',
        transmettreDateMiseEnService: 'Lauréat.Raccordement.Command.TransmettreDateMiseEnService',
        transmettreDemandeComplète:
          'Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
        transmettrePropositionTechniqueEtFinancière:
          'Lauréat.Raccordement.Command.TransmettrePropositionTechniqueEtFinancière',
        supprimerDossierDuRaccordement:
          'Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement',
      },
    },
    garantiesFinancières: {
      query: {
        consulterGarantiesFinancièresActuelles:
          'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        listerArchivesGarantiesFinancières:
          'Lauréat.GarantiesFinancières.Query.ListerArchivesGarantiesFinancières',
        consulterDépôtGarantiesFinancières:
          'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
        listerDépôts: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsGarantiesFinancières',
        listerProjetsAvecGarantiesFinancièresEnAttente:
          'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancièresEnAttente',
        consulterProjetAvecGarantiesFinancièresEnAttente:
          'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
        listerMainlevée: 'Lauréat.GarantiesFinancières.Query.ListerMainlevées',
        consulterMainlevéeEnCours: 'Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours',
      },
      usecase: {
        soumettre: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
        supprimerGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.UseCase.SupprimerDépôtGarantiesFinancières',
        valider: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
        modifierGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
        modifier: 'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
        enregistrerAttestation: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
        enregistrer: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
        demanderMainlevée: 'Lauréat.GarantiesFinancières.UseCase.DemanderMainlevée',
        annulerMainlevée: 'Lauréat.GarantiesFinancières.UseCase.AnnulerMainlevée',
        démarrerInstructionMainlevée:
          'Lauréat.GarantiesFinancières.UseCase.DémarrerInstructionMainlevée',
        accorderMainlevée: 'Lauréat.GarantiesFinancières.UseCase.AccorderMainlevée',
        rejeterMainlevée: 'Lauréat.GarantiesFinancières.UseCase.RejeterMainlevée',
        renouveler: 'Lauréat.GarantiesFinancières.UseCase.RenouvelerGarantiesFinancières',
      },
      command: {
        soumettre: 'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
        supprimerGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancières',
        valider: 'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
        modifierGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
        modifier: 'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
        enregistrerAttestation: 'Lauréat.GarantiesFinancières.Command.EnregistrerAttestation',
        enregistrer: 'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
        demanderMainlevée: 'Lauréat.GarantiesFinancières.Command.DemanderMainlevée',
        annulerMainlevée: 'Lauréat.GarantiesFinancières.Command.AnnulerMainlevée',
        démarrerInstructionMainlevée:
          'Lauréat.GarantiesFinancières.Command.DémarrerInstructionMainlevée',
        accorderMainlevée: 'Lauréat.GarantiesFinancières.Command.AccorderMainlevée',
        rejeterMainlevée: 'Lauréat.GarantiesFinancières.Command.RejeterMainlevée',
      },
    },
    achèvement: {
      command: {
        transmettreAttestationConformité:
          'Lauréat.AchèvementCommand.TransmettreAttestationConformité',
        modifierAttestationConformité: 'Lauréat.AchèvementCommand.ModifierAttestationConformité',
        transmettreDateAchèvement: 'Lauréat.Achèvement.Command.TransmettreDateAchèvement',
      },
      useCase: {
        transmettreAttestationConformité:
          'Lauréat.AchèvementUseCase.TransmettreAttestationConformité',
        modifierAttestationConformité: 'Lauréat.AchèvementUseCase.ModifierAttestationConformité',
        transmettreDateAchèvement: 'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
      },
      query: {
        consulter: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      },
    },
    représentantLégal: {
      query: {
        consulter: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        consulterChangement: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        consulterChangementEnCours:
          'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
        listerChangement: 'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
        listerHistoriqueReprésentantLégal:
          'Lauréat.ReprésentantLégal.Query.ListerHistoriqueReprésentantLégalProjet',
      },
      usecase: {
        modifier: 'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
        demanderChangement: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
        annulerChangement: 'Lauréat.ReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal',
        corrigerChangement: 'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
        accorderChangement: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
        enregistrerChangement:
          'Lauréat.ReprésentantLégal.UseCase.EnregistrerChangementReprésentantLégal',
        rejeterChangement: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
      },
      command: {
        modifier: 'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
        demanderChangement: 'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
        annulerChangement: 'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
        corrigerChangement: 'Lauréat.ReprésentantLégal.Command.CorrigerChangementReprésentantLégal',
        accorderChangement: 'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
        rejeterChangement: 'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
        enregistrerChangement:
          'Lauréat.ReprésentantLégal.Command.EnregistrerChangementReprésentantLégal',
        supprimerDocumentSensible:
          'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
      },
    },
    actionnaire: {
      query: {
        consulter: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        consulterChangement: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
        listerChangement: 'Lauréat.Actionnaire.Query.ListerChangementActionnaire',
        listerHistoriqueActionnaire: 'Lauréat.Actionnaire.Query.ListerHistoriqueActionnaireProjet',
      },
      usecase: {
        modifier: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
        enregistrerChangement: 'Lauréat.Actionnaire.UseCase.EnregistrerChangement',
        demanderChangement: 'Lauréat.Actionnaire.UseCase.DemanderChangement',
        accorderChangement: 'Lauréat.Actionnaire.UseCase.AccorderDemandeChangement',
        rejeterChangement: 'Lauréat.Actionnaire.UseCase.RejeterDemandeChangement',
        annulerChangement: 'Lauréat.Actionnaire.UseCase.AnnulerDemandeChangement',
      },
      command: {
        modifier: 'Lauréat.Actionnaire.Command.ModifierActionnaire',
        enregistrerChangement: 'Lauréat.Actionnaire.Command.EnregistrerChangement',
        demanderChangement: 'Lauréat.Actionnaire.Command.DemanderChangement',
        accorderChangement: 'Lauréat.Actionnaire.Command.AccorderDemandeChangement',
        rejeterChangement: 'Lauréat.Actionnaire.Command.RejeterDemandeChangement',
        annulerChangement: 'Lauréat.Actionnaire.Command.AnnulerDemandeChangement',
      },
    },
    puissance: {
      query: {
        consulter: 'Lauréat.Puissance.Query.ConsulterPuissance',
        consulterChangement: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
        listerChangement: 'Lauréat.Puissance.Query.ListerChangementPuissance',
        listerHistoriquePuissance: 'Lauréat.Puissance.Query.ListerHistoriquePuissanceProjet',
        consulterVolumeRéservé: 'Lauréat.Puissance.Query.ConsulterVolumeRéservé',
      },
      usecase: {
        modifier: 'Lauréat.Puissance.UseCase.ModifierPuissance',
        enregistrerChangement: 'Lauréat.Puissance.UseCase.EnregistrerChangement',
        demanderChangement: 'Lauréat.Puissance.UseCase.DemanderChangement',
        annulerChangement: 'Lauréat.Puissance.UseCase.AnnulerDemandeChangement',
        accorderChangement: 'Lauréat.Puissance.UseCase.AccorderDemandeChangement',
        rejeterChangement: 'Lauréat.Puissance.UseCase.RejeterDemandeChangement',
      },
      command: {
        modifier: 'Lauréat.Puissance.Command.ModifierPuissance',
        enregistrerChangement: 'Lauréat.Puissance.Command.EnregistrerChangement',
        demanderChangement: 'Lauréat.Puissance.Command.DemanderChangement',
        annulerChangement: 'Lauréat.Puissance.Command.AnnulerDemandeChangement',
        accorderChangement: 'Lauréat.Puissance.Command.AccorderDemandeChangement',
        rejeterChangement: 'Lauréat.Puissance.Command.RejeterDemandeChangement',
      },
    },
    producteur: {
      query: {
        consulter: 'Lauréat.Producteur.Query.ConsulterProducteur',
        consulterChangement: 'Lauréat.Producteur.Query.ConsulterChangementProducteur',
        listerChangement: 'Lauréat.Producteur.Query.ListerChangementProducteur',
        listerHistoriqueProducteur: 'Lauréat.Producteur.Query.ListerHistoriqueProducteurProjet',
      },
      usecase: {
        modifier: 'Lauréat.Producteur.UseCase.ModifierProducteur',
        enregistrerChangement: 'Lauréat.Producteur.UseCase.EnregistrerChangement',
      },
      command: {
        modifier: 'Lauréat.Producteur.Command.ModifierProducteur',
        enregistrerChangement: 'Lauréat.Producteur.Command.EnregistrerChangement',
      },
    },
    installation: {
      query: {
        consulter: 'Lauréat.Installation.Query.ConsulterInstallation',
        listerHistorique: 'Lauréat.Installation.Query.ListerHistoriqueInstallationProjet',
      },
      dispositifDeStockage: {
        query: {
          consulter: 'Lauréat.Installation.Query.ConsulterDispositifDeStockage',
          listerChangement: 'Lauréat.Installation.Query.ListerChangementDispositifDeStockage',
          consulterChangement: 'Lauréat.Installation.Query.ConsulterChangementDispositifDeStockage',
        },
        usecase: {
          modifier: 'Lauréat.Installation.UseCase.ModifierDispositifDeStockage',
          enregistrerChangement:
            'Lauréat.Installation.UseCase.EnregistrerChangementDispositifDeStockage',
        },
        command: {
          modifier: 'Lauréat.Installation.Command.ModifierDispositifDeStockage',
          enregistrerChangement:
            'Lauréat.Installation.Command.EnregistrerChangementDispositifDeStockage',
        },
      },
      installateur: {
        query: {
          consulter: 'Lauréat.Installation.Query.ConsulterInstallateur',
          consulterChangement: 'Lauréat.Installateur.Query.ConsulterChangementInstallateur',
          listerChangement: 'Lauréat.Installateur.Query.ListerChangementInstallateur',
        },
        usecase: {
          modifier: 'Lauréat.Installation.UseCase.ModifierInstallateur',
          enregistrerChangement: 'Lauréat.Installateur.UseCase.EnregistrerChangement',
        },
        command: {
          modifier: 'Lauréat.Installation.Command.ModifierInstallateur',
          enregistrerChangement: 'Lauréat.Installateur.Command.EnregistrerChangement',
        },
      },
      typologieInstallation: {
        query: {
          consulter: 'Lauréat.Installation.Query.ConsulterTypologieInstallation',
        },
        usecase: {
          modifier: 'Lauréat.Installation.UseCase.ModifierTypologieInstallation',
        },
        command: {
          modifier: 'Lauréat.Installation.Command.ModifierTypologieInstallation',
        },
      },
    },
    natureDeLExploitation: {
      query: {
        consulter: 'Lauréat.NatureDeLExploitation.Query.ConsulterNatureDeLExploitation',
        consulterChangement:
          'Lauréat.NatureDeLExploitation.Query.ConsulterChangementNatureDeLExploitation',
        listerChangement:
          'Lauréat.NatureDeLExploitation.Query.ListerChangementsNatureDeLExploitation',
        listerHistoriqueNatureDeLExploitation:
          'Lauréat.NatureDeLExploitation.Query.ListerHistoriqueNatureDeLExploitationProjet',
      },
      usecase: {
        modifier: 'Lauréat.NatureDeLExploitation.UseCase.ModifierNatureDeLExploitation',
        enregistrerChangement: 'Lauréat.NatureDeLExploitation.UseCase.EnregistrerChangement',
      },
      command: {
        modifier: 'Lauréat.NatureDeLExploitation.Command.ModifierNatureDeLExploitation',
        enregistrerChangement: 'Lauréat.NatureDeLExploitation.Command.EnregistrerChangement',
      },
    },
    fournisseur: {
      query: {
        consulter: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
        consulterChangement: 'Lauréat.Fournisseur.Query.ConsulterChangementFournisseur',
        listerChangement: 'Lauréat.Fournisseur.Query.ListerChangementFournisseur',
        listerHistoriqueFournisseur: 'Lauréat.Fournisseur.Query.ListerHistoriqueFournisseurProjet',
      },
      usecase: {
        modifierÉvaluationCarbone: 'Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone',
        enregistrerChangement: 'Lauréat.Fournisseur.UseCase.MettreÀJour',
        modifier: 'Lauréat.Fournisseur.UseCase.MettreÀJour',
      },
      command: {
        modifierÉvaluationCarbone: 'Lauréat.Fournisseur.Command.ModifierÉvaluationCarbone',
        enregistrerChangement: 'Lauréat.Fournisseur.Command.MettreÀJour',
        modifier: 'Lauréat.Fournisseur.Command.MettreÀJour',
      },
    },
    cahierDesCharges: {
      query: {
        consulter: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
      },
      command: {
        choisir: 'Lauréat.Command.ChoisirCahierDesCharges',
      },
      usecase: {
        choisir: 'Lauréat.UseCase.ChoisirCahierDesCharges',
      },
    },
    délai: {
      query: {
        consulter: 'Lauréat.Délai.Query.ConsulterDélai',
        consulterChangement: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
        listerChangement: 'Lauréat.Délai.Query.ListerDemandeDélai',
        listerHistorique: 'Lauréat.Délai.Query.ListerHistoriqueDélaiProjet',
      },
      usecase: {
        demanderChangement: 'Lauréat.Délai.UseCase.DemanderDélai',
        annulerChangement: 'Lauréat.Délai.UseCase.AnnulerDemande',
        passerEnInstruction: 'Lauréat.Délai.UseCase.PasserEnInstructionDemande',
        rejeterChangement: 'Lauréat.Délai.UseCase.RejeterDemandeDélai',
        accorderChangement: 'Lauréat.Délai.UseCase.AccorderDemandeDélai',
        corrigerChangement: 'Lauréat.Délai.UseCase.CorrigerDemandeDélai',
      },
      command: {
        demanderChangement: 'Lauréat.Délai.Command.DemanderDélai',
        annulerChangement: 'Lauréat.Délai.Command.AnnulerDemande',
        passerEnInstruction: 'Lauréat.Délai.Command.PasserEnInstructionDemande',
        rejeterChangement: 'Lauréat.Délai.Command.RejeterDemandeDélai',
        accorderChangement: 'Lauréat.Délai.Command.AccorderDemandeDélai',
        corrigerChangement: 'Lauréat.Délai.Command.CorrigerDemandeDélai',
      },
    },
    nomProjet: {
      query: {
        consulterChangement: 'Lauréat.Query.ConsulterChangementNomProjet',
        listerChangement: 'Lauréat.Query.ListerChangementNomProjet',
      },
      usecase: {
        modifier: 'Lauréat.UseCase.ModifierNomProjet',
        enregistrerChangement: 'Lauréat.UseCase.EnregistrerChangementNomProjet',
      },
      command: {
        modifier: 'Lauréat.Command.ModifierNomProjet',
        enregistrerChangement: 'Lauréat.Command.EnregistrerChangementNomProjet',
      },
    },
    usecase: {
      modifierSiteDeProduction: 'Lauréat.UseCase.ModifierSiteDeProduction',
    },
    command: {
      notifier: 'Lauréat.Command.NotifierLauréat',
      modifierSiteDeProduction: 'Lauréat.Command.ModifierSiteDeProduction',
    },
    query: {
      consulter: 'Lauréat.Query.ConsulterLauréat',
      lister: 'Lauréat.Query.ListerLauréat',
      listerHistorique: 'Lauréat.Query.ListerHistoriqueLauréat',
    },
  },
  éliminé: {
    query: { consulter: 'Éliminé.Query.ConsulterÉliminé', lister: 'Éliminé.Query.ListerÉliminé' },
    command: {
      notifier: 'Éliminé.Command.NotifierÉliminé',
    },
    recours: {
      query: {
        consulter: 'Éliminé.Recours.Query.ConsulterRecours',
        lister: 'Éliminé.Recours.Query.ListerRecours',
        listerHistoriqueRecours: 'Éliminé.Query.ListerHistoriqueRecoursProjet',
      },
      usecase: {
        annuler: 'Éliminé.Recours.UseCase.AnnulerRecours',
        demander: 'Éliminé.Recours.UseCase.DemanderRecours',
        accorder: 'Éliminé.Recours.UseCase.AccorderRecours',
        rejeter: 'Éliminé.Recours.UseCase.RejeterRecours',
        passerEnInstruction: 'Éliminé.Recours.UseCase.PasserRecoursEnInstruction',
      },
      command: {
        annuler: 'Éliminé.Recours.Command.AnnulerRecours',
        demander: 'Éliminé.Recours.Command.DemanderRecours',
        accorder: 'Éliminé.Recours.Command.AccorderRecours',
        rejeter: 'Éliminé.Recours.Command.RejeterRecours',
        passerEnInstruction: 'Éliminé.Recours.Command.PasserRecoursEnInstruction',
      },
    },
  },
  appelOffre: {
    query: {
      consulter: 'AppelOffre.Query.ConsulterAppelOffre',
      lister: 'AppelOffre.Query.ListerAppelOffre',
    },
  },
  candidature: {
    query: {
      consulterCandidature: 'Candidature.Query.ConsulterCandidature',
      consulterProjet: 'Candidature.Query.ConsulterProjet',
      listerProjetsPreuveRecandidature:
        'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
      listerCandidatures: 'Candidature.Query.ListerCandidatures',
    },
    usecase: {
      importer: 'Candidature.UseCase.ImporterCandidature',
      corriger: 'Candidature.UseCase.CorrigerCandidature',
      notifier: 'Candidature.UseCase.NotifierCandidature',
    },
    command: {
      importer: 'Candidature.Command.ImporterCandidature',
      corriger: 'Candidature.Command.CorrigerCandidature',
      notifier: 'Candidature.Command.NotifierCandidature',
    },
  },
  période: {
    query: {
      consulter: 'Période.Query.ConsulterPériode',
      lister: 'Période.Query.ListerPériodes',
    },
    usecase: {
      notifier: 'Période.UseCase.NotifierPériode',
    },
    command: {
      notifier: 'Période.Command.NotifierPériode',
    },
  },
  document: {
    query: {
      consulter: 'Document.Query.ConsulterDocumentProjet',
    },
    command: {
      enregister: 'Document.Command.EnregistrerDocumentProjet',
      enregisterSubstitut: 'Document.Command.EnregistrerDocumentSubstitut',
      déplacer: 'Document.Command.DéplacerDocumentProjet',
      corriger: 'Document.Command.CorrigerDocumentProjet',
    },
  },
  réseau: {
    gestionnaire: {
      query: {
        consulter: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
        lister: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
      },
      usecase: {
        ajouter: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
        modifier: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
      },
      command: {
        ajouter: 'Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau',
        modifier: 'Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau',
      },
    },
  },
  accès: {
    query: {
      consulter: 'Projet.Accès.Query.ConsulterAccès',
      lister: 'Projet.Accès.Query.ListerAccès',
      listerProjetsÀRéclamer: 'Projet.Accès.Query.ListerProjetsÀRéclamer',
    },
    command: {
      autoriserAccèsProjet: 'Projet.Accès.Command.AutoriserAccèsProjet',
      retirerAccèsProjet: 'Projet.Accès.Command.RetirerAccèsProjet',
      remplacerAccèsProjet: 'Projet.Accès.Command.RemplacerAccèsProjet',
      réclamerProjet: 'Projet.Accès.Command.RéclamerAccèsProjet',
    },
    usecase: {
      autoriserAccèsProjet: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
      retirerAccèsProjet: 'Projet.Accès.UseCase.RetirerAccèsProjet',
      remplacerAccèsProjet: 'Projet.Accès.UseCase.RemplacerAccèsProjet',
      réclamerProjet: 'Projet.Accès.UseCase.RéclamerAccèsProjet',
    },
  },
  utilisateur: {
    query: {
      consulter: 'Utilisateur.Query.ConsulterUtilisateur',
      lister: 'Utilisateur.Query.ListerUtilisateurs',
    },
    command: {
      inviter: 'Utilisateur.Command.InviterUtilisateur',
      inviterPorteur: 'Utilisateur.Command.InviterPorteur',
      créerPorteur: 'Utilisateur.Command.CréerPorteur',
      désactiver: 'Utilisateur.Command.DésactiverUtilisateur',
      réactiver: 'Utilisateur.Command.RéactiverUtilisateur',
      modifierRôle: 'Utilisateur.Command.ModifierRôleUtilisateur',
    },
    usecase: {
      inviter: 'Utilisateur.UseCase.InviterUtilisateur',
      inviterPorteur: 'Utilisateur.UseCase.InviterPorteur',
      désactiver: 'Utilisateur.UseCase.DésactiverUtilisateur',
      réactiver: 'Utilisateur.UseCase.RéactiverUtilisateur',
      modifierRôle: 'Utilisateur.UseCase.ModifierRôleUtilisateur',
    },
  },
  tâche: {
    query: {
      consulterNombre: 'Tâche.Query.ConsulterNombreTâches',
      lister: 'Tâche.Query.ListerTâches',
    },
  },
  historique: {
    query: {
      lister: 'Lauréat.Query.ListerHistoriqueProjet',
    },
  },
} as const;

/**
 * Liste des droits fonctionnels, par domaine
 */
const policies = {
  réseau: {
    gestionnaire: {
      lister: [référencielPermissions.réseau.gestionnaire.query.lister],
      ajouter: [
        référencielPermissions.réseau.gestionnaire.usecase.ajouter,
        référencielPermissions.réseau.gestionnaire.command.ajouter,
      ],
      modifier: [
        référencielPermissions.réseau.gestionnaire.query.consulter,
        référencielPermissions.réseau.gestionnaire.usecase.modifier,
        référencielPermissions.réseau.gestionnaire.command.modifier,
      ],
      consulter: [référencielPermissions.réseau.gestionnaire.query.consulter],
    },
  },
  abandon: {
    consulter: {
      liste: [
        référencielPermissions.lauréat.abandon.query.lister,
        référencielPermissions.appelOffre.query.lister,
      ],
      détail: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.candidature.query.listerProjetsPreuveRecandidature,
        référencielPermissions.lauréat.abandon.query.consulter,
        référencielPermissions.document.query.consulter,
      ],
    },
    demander: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.usecase.demander,
      référencielPermissions.lauréat.abandon.command.demander,
    ],
    annuler: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.annuler,
      référencielPermissions.lauréat.abandon.command.annuler,
    ],
    confirmer: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.confirmer,
      référencielPermissions.lauréat.abandon.command.confirmer,
    ],
    accorder: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.accorder,
      référencielPermissions.lauréat.abandon.command.accorder,
    ],
    rejeter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.rejeter,
      référencielPermissions.lauréat.abandon.command.rejeter,
    ],
    'demander-confirmation': [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.usecase.demanderConfirmation,
      référencielPermissions.lauréat.abandon.command.demanderConfirmation,
    ],
    'preuve-recandidature': {
      transmettre: [
        référencielPermissions.lauréat.abandon.query.consulter,
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.candidature.query.listerProjetsPreuveRecandidature,
        référencielPermissions.lauréat.abandon.usecase.transmettrePreuveRecandidature,
        référencielPermissions.lauréat.abandon.command.transmettrePreuveRecandidature,
      ],
      accorder: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.utilisateur.query.consulter,
        référencielPermissions.utilisateur.query.consulter,
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.abandon.query.consulter,
        référencielPermissions.lauréat.abandon.usecase.accorder,
        référencielPermissions.lauréat.abandon.command.accorder,
      ],
    },
    'passer-en-instruction': [
      référencielPermissions.lauréat.abandon.usecase.passerEnInstruction,
      référencielPermissions.lauréat.abandon.command.passerEnInstruction,
    ],
  },
  recours: {
    consulter: {
      liste: [
        référencielPermissions.éliminé.recours.query.lister,
        référencielPermissions.appelOffre.query.lister,
      ],
      détail: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.candidature.query.listerProjetsPreuveRecandidature,
        référencielPermissions.éliminé.recours.query.consulter,
        référencielPermissions.document.query.consulter,
      ],
    },
    demander: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.éliminé.recours.usecase.demander,
      référencielPermissions.éliminé.recours.command.demander,
    ],
    annuler: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.éliminé.recours.query.consulter,
      référencielPermissions.éliminé.recours.usecase.annuler,
      référencielPermissions.éliminé.recours.command.annuler,
    ],
    accorder: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.éliminé.recours.query.consulter,
      référencielPermissions.éliminé.recours.usecase.accorder,
      référencielPermissions.éliminé.recours.command.accorder,
    ],
    rejeter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.éliminé.recours.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.éliminé.recours.usecase.rejeter,
      référencielPermissions.éliminé.recours.command.rejeter,
    ],
    'passer-en-instruction': [
      référencielPermissions.éliminé.recours.usecase.passerEnInstruction,
      référencielPermissions.éliminé.recours.command.passerEnInstruction,
    ],
  },
  tâche: {
    consulter: [
      référencielPermissions.tâche.query.consulterNombre,
      référencielPermissions.tâche.query.lister,
    ],
  },
  garantiesFinancières: {
    dépôt: {
      consulter: [
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.garantiesFinancières.query
          .consulterDépôtGarantiesFinancières,
      ],
      soumettre: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.garantiesFinancières.usecase.soumettre,
        référencielPermissions.lauréat.garantiesFinancières.command.soumettre,
        référencielPermissions.document.command.enregister,
      ],
      valider: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.valider,
        référencielPermissions.lauréat.garantiesFinancières.command.valider,
        référencielPermissions.document.command.déplacer,
      ],
      supprimer: [
        référencielPermissions.lauréat.garantiesFinancières.usecase
          .supprimerGarantiesFinancièresÀTraiter,
        référencielPermissions.lauréat.garantiesFinancières.command
          .supprimerGarantiesFinancièresÀTraiter,
      ],
      modifier: [
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.garantiesFinancières.usecase
          .modifierGarantiesFinancièresÀTraiter,
        référencielPermissions.lauréat.garantiesFinancières.command
          .modifierGarantiesFinancièresÀTraiter,
        référencielPermissions.document.command.enregister,
      ],
      lister: [
        référencielPermissions.lauréat.garantiesFinancières.query.listerDépôts,
        référencielPermissions.appelOffre.query.lister,
      ],
    },
    archives: {
      lister: [
        référencielPermissions.lauréat.garantiesFinancières.query
          .listerArchivesGarantiesFinancières,
      ],
    },
    actuelles: {
      consulter: [
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.garantiesFinancières.query
          .consulterGarantiesFinancièresActuelles,
      ],
      modifier: [
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.garantiesFinancières.usecase.modifier,
        référencielPermissions.lauréat.garantiesFinancières.command.modifier,
      ],
      enregistrerAttestation: [
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.garantiesFinancières.usecase.enregistrerAttestation,
        référencielPermissions.lauréat.garantiesFinancières.command.enregistrerAttestation,
      ],
      enregistrer: [
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.garantiesFinancières.usecase.enregistrer,
        référencielPermissions.lauréat.garantiesFinancières.command.enregistrer,
      ],
    },
    mainlevée: {
      demander: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.demanderMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.demanderMainlevée,
      ],
      lister: [référencielPermissions.lauréat.garantiesFinancières.query.listerMainlevée],
      consulter: [
        référencielPermissions.lauréat.garantiesFinancières.query.consulterMainlevéeEnCours,
      ],
      annuler: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.annulerMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.annulerMainlevée,
      ],
      démarrerInstruction: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.démarrerInstructionMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.démarrerInstructionMainlevée,
      ],
      accorder: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.accorderMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.accorderMainlevée,
        référencielPermissions.document.command.enregister,
        référencielPermissions.document.command.corriger,
      ],
      rejeter: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.rejeterMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.rejeterMainlevée,
        référencielPermissions.document.command.enregister,
      ],
    },
    enAttente: {
      lister: [
        référencielPermissions.lauréat.garantiesFinancières.query
          .listerProjetsAvecGarantiesFinancièresEnAttente,
        référencielPermissions.appelOffre.query.lister,
      ],
      consulter: [
        référencielPermissions.lauréat.garantiesFinancières.query
          .consulterProjetAvecGarantiesFinancièresEnAttente,
      ],
      générerModèleMiseEnDemeure: [
        référencielPermissions.utilisateur.query.consulter,
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.garantiesFinancières.query
          .consulterProjetAvecGarantiesFinancièresEnAttente,
      ],
    },
  },
  achèvement: {
    consulter: [
      référencielPermissions.lauréat.achèvement.query.consulter,
      référencielPermissions.document.query.consulter,
    ],
    transmettreAttestation: [
      référencielPermissions.lauréat.achèvement.useCase.transmettreAttestationConformité,
      référencielPermissions.lauréat.achèvement.command.transmettreAttestationConformité,
      référencielPermissions.document.command.enregister,
    ],
    transmettreDate: [
      référencielPermissions.lauréat.achèvement.useCase.transmettreDateAchèvement,
      référencielPermissions.lauréat.achèvement.command.transmettreDateAchèvement,
      référencielPermissions.document.command.enregisterSubstitut,
    ],
    modifier: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.achèvement.query.consulter,
      référencielPermissions.lauréat.achèvement.useCase.modifierAttestationConformité,
      référencielPermissions.lauréat.achèvement.command.modifierAttestationConformité,
      référencielPermissions.document.command.enregister,
    ],
  },
  candidature: {
    consulter: [référencielPermissions.candidature.query.consulterCandidature],
    importer: [
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.candidature.usecase.importer,
      référencielPermissions.candidature.command.importer,
    ],
    corriger: [
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.candidature.usecase.corriger,
      référencielPermissions.candidature.command.corriger,
    ],
    lister: [
      référencielPermissions.candidature.query.listerCandidatures,
      référencielPermissions.appelOffre.query.lister,
    ],
    attestation: {
      prévisualiser: [
        référencielPermissions.utilisateur.query.consulter,
        référencielPermissions.appelOffre.query.consulter,
      ],
      télécharger: [
        référencielPermissions.lauréat.query.consulter,
        référencielPermissions.éliminé.query.consulter,
        référencielPermissions.document.query.consulter,
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.éliminé.recours.query.consulter,
      ],
    },
  },
  période: {
    consulter: [référencielPermissions.période.query.consulter],
    lister: [référencielPermissions.période.query.lister],
    notifier: [
      référencielPermissions.période.usecase.notifier,
      référencielPermissions.période.command.notifier,
      référencielPermissions.lauréat.command.notifier,
      référencielPermissions.éliminé.command.notifier,
      référencielPermissions.candidature.usecase.notifier,
      référencielPermissions.candidature.command.notifier,
    ],
  },
  représentantLégal: {
    consulter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.représentantLégal.query.consulter,
    ],
    modifier: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.représentantLégal.usecase.modifier,
      référencielPermissions.lauréat.représentantLégal.command.modifier,
    ],
    corrigerChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.corrigerChangement,
      référencielPermissions.lauréat.représentantLégal.command.corrigerChangement,
      référencielPermissions.document.command.corriger,
    ],
    demanderChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.demanderChangement,
      référencielPermissions.lauréat.représentantLégal.command.demanderChangement,
      référencielPermissions.document.command.enregister,
    ],
    annulerChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.annulerChangement,
      référencielPermissions.lauréat.représentantLégal.command.annulerChangement,
      référencielPermissions.lauréat.représentantLégal.command.supprimerDocumentSensible,
    ],
    accorderChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.accorderChangement,
      référencielPermissions.lauréat.représentantLégal.command.accorderChangement,
      référencielPermissions.lauréat.représentantLégal.command.supprimerDocumentSensible,
    ],
    rejeterChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.rejeterChangement,
      référencielPermissions.lauréat.représentantLégal.command.rejeterChangement,
      référencielPermissions.lauréat.représentantLégal.command.supprimerDocumentSensible,
    ],
    consulterChangement: [
      référencielPermissions.lauréat.représentantLégal.query.consulterChangement,
      référencielPermissions.lauréat.représentantLégal.query.consulterChangementEnCours,
      référencielPermissions.document.query.consulter,
    ],
    enregistrerChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.enregistrerChangement,
      référencielPermissions.lauréat.représentantLégal.command.enregistrerChangement,
      référencielPermissions.document.command.enregister,
    ],
    listerChangement: [
      référencielPermissions.appelOffre.query.lister,
      référencielPermissions.lauréat.représentantLégal.query.listerChangement,
    ],
  },
  installation: {
    consulter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.installation.query.consulter,
      référencielPermissions.lauréat.installation.installateur.query.consulter,
      référencielPermissions.lauréat.installation.typologieInstallation.query.consulter,
      référencielPermissions.lauréat.installation.dispositifDeStockage.query.consulter,
    ],
    dispositifDeStockage: {
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.lauréat.installation.dispositifDeStockage.usecase.modifier,
        référencielPermissions.lauréat.installation.dispositifDeStockage.command.modifier,
      ],
      consulterChangement: [
        référencielPermissions.lauréat.installation.dispositifDeStockage.query.consulterChangement,
        référencielPermissions.document.query.consulter,
        référencielPermissions.lauréat.installation.query.listerHistorique,
      ],
      enregistrerChangement: [
        référencielPermissions.lauréat.installation.dispositifDeStockage.usecase
          .enregistrerChangement,
        référencielPermissions.lauréat.installation.dispositifDeStockage.command
          .enregistrerChangement,
        référencielPermissions.document.command.enregister,
      ],
      listerChangement: [
        référencielPermissions.appelOffre.query.lister,
        référencielPermissions.lauréat.installation.dispositifDeStockage.query.listerChangement,
      ],
    },
    installateur: {
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.lauréat.installation.installateur.usecase.modifier,
        référencielPermissions.lauréat.installation.installateur.command.modifier,
      ],
      consulterChangement: [
        référencielPermissions.lauréat.installation.installateur.query.consulterChangement,
        référencielPermissions.document.query.consulter,
        référencielPermissions.lauréat.installation.query.listerHistorique,
      ],
      enregistrerChangement: [
        référencielPermissions.lauréat.installation.installateur.usecase.enregistrerChangement,
        référencielPermissions.lauréat.installation.installateur.command.enregistrerChangement,
        référencielPermissions.document.command.enregister,
      ],
      listerChangement: [
        référencielPermissions.appelOffre.query.lister,
        référencielPermissions.lauréat.installation.installateur.query.listerChangement,
      ],
    },
    typologieInstallation: {
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.lauréat.installation.typologieInstallation.usecase.modifier,
        référencielPermissions.lauréat.installation.typologieInstallation.command.modifier,
      ],
    },
  },
  natureDeLExploitation: {
    consulter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.natureDeLExploitation.query.consulter,
    ],
    modifier: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.natureDeLExploitation.usecase.modifier,
      référencielPermissions.lauréat.natureDeLExploitation.command.modifier,
    ],
    consulterChangement: [
      référencielPermissions.lauréat.natureDeLExploitation.query.consulterChangement,
      référencielPermissions.document.query.consulter,
    ],
    enregistrerChangement: [
      référencielPermissions.lauréat.natureDeLExploitation.usecase.enregistrerChangement,
      référencielPermissions.lauréat.natureDeLExploitation.command.enregistrerChangement,
      référencielPermissions.document.command.enregister,
    ],
    listerChangement: [
      référencielPermissions.appelOffre.query.lister,
      référencielPermissions.lauréat.natureDeLExploitation.query.listerChangement,
    ],
  },
  historique: {
    lister: [
      référencielPermissions.historique.query.lister,
      référencielPermissions.lauréat.abandon.query.listerHistoriqueAbandon,
      référencielPermissions.lauréat.actionnaire.query.listerHistoriqueActionnaire,
      référencielPermissions.lauréat.producteur.query.listerHistoriqueProducteur,
      référencielPermissions.lauréat.puissance.query.listerHistoriquePuissance,
      référencielPermissions.éliminé.recours.query.listerHistoriqueRecours,
      référencielPermissions.lauréat.représentantLégal.query.listerHistoriqueReprésentantLégal,
      référencielPermissions.lauréat.raccordement.query.listerHistoriqueRaccordement,
      référencielPermissions.lauréat.fournisseur.query.listerHistoriqueFournisseur,
      référencielPermissions.lauréat.natureDeLExploitation.query
        .listerHistoriqueNatureDeLExploitation,
      référencielPermissions.lauréat.installation.query.listerHistorique,
    ],
    imprimer: [],
  },
  raccordement: {
    listerDossierRaccordement: [
      référencielPermissions.lauréat.raccordement.query
        .listerDossierRaccordementEnAttenteMiseEnService,
      référencielPermissions.lauréat.raccordement.query.listerDossierRaccordement,
      référencielPermissions.appelOffre.query.lister,
      référencielPermissions.réseau.gestionnaire.query.lister,
    ],
    consulter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.raccordement.query.consulter,
      référencielPermissions.lauréat.raccordement.query.consulterNombre,
      référencielPermissions.lauréat.raccordement.query.consulterDossier,
      référencielPermissions.document.query.consulter,
      référencielPermissions.réseau.gestionnaire.query.consulter,
    ],
    'demande-complète-raccordement': {
      transmettre: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.document.command.enregister,
        référencielPermissions.réseau.gestionnaire.query.lister,
        référencielPermissions.lauréat.raccordement.query.consulterGestionnaireRéseau,
        référencielPermissions.lauréat.raccordement.usecase.transmettreDemandeComplète,
        référencielPermissions.lauréat.raccordement.command.transmettreDemandeComplète,
      ],
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.raccordement.query.consulterGestionnaireRéseau,
        référencielPermissions.lauréat.raccordement.query.consulterDossier,
        référencielPermissions.lauréat.raccordement.usecase.modifierDemandeComplète,
        référencielPermissions.lauréat.raccordement.command.modifierDemandeComplète,
      ],
    },
    'proposition-technique-et-financière': {
      transmettre: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.raccordement.query.consulterDossier,
        référencielPermissions.lauréat.raccordement.usecase
          .transmettrePropositionTechniqueEtFinancière,
        référencielPermissions.lauréat.raccordement.command
          .transmettrePropositionTechniqueEtFinancière,
      ],
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.raccordement.query.consulterDossier,
        référencielPermissions.lauréat.raccordement.usecase.modifierPropostionTechniqueEtFinancière,
        référencielPermissions.lauréat.raccordement.command.modifierPropostionTechniqueEtFinancière,
      ],
    },
    'date-mise-en-service': {
      transmettre: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.raccordement.query.consulterDossier,
        référencielPermissions.lauréat.raccordement.usecase.transmettreDateMiseEnService,
        référencielPermissions.lauréat.raccordement.command.transmettreDateMiseEnService,
      ],
      importer: [
        référencielPermissions.lauréat.raccordement.query.rechercher,
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.lauréat.raccordement.usecase.transmettreDateMiseEnService,
        référencielPermissions.lauréat.raccordement.command.transmettreDateMiseEnService,
      ],
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.raccordement.query.consulterDossier,
        // TODO ca devrait être modifierDateMiseEnService, mais pour le moment, la modification se fait va le même usecase
        référencielPermissions.lauréat.raccordement.usecase.transmettreDateMiseEnService,
        référencielPermissions.lauréat.raccordement.command.transmettreDateMiseEnService,
      ],
    },
    'référence-dossier': {
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.document.command.déplacer,
        référencielPermissions.lauréat.raccordement.query.consulterGestionnaireRéseau,
        référencielPermissions.lauréat.raccordement.query.consulterDossier,
        référencielPermissions.lauréat.raccordement.usecase.modifierRéférenceDossier,
        référencielPermissions.lauréat.raccordement.command.modifierRéférenceDossier,
      ],
    },
    dossier: {
      supprimer: [
        référencielPermissions.lauréat.raccordement.usecase.supprimerDossierDuRaccordement,
        référencielPermissions.lauréat.raccordement.command.supprimerDossierDuRaccordement,
      ],
    },
    gestionnaire: {
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.réseau.gestionnaire.query.lister,
        référencielPermissions.lauréat.raccordement.query.consulterGestionnaireRéseau,
        référencielPermissions.lauréat.raccordement.usecase.modifierGestionnaireRéseau,
        référencielPermissions.lauréat.raccordement.command.modifierGestionnaireRéseau,
      ],
    },
  },
  actionnaire: {
    consulter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.actionnaire.query.consulter,
    ],
    modifier: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.actionnaire.usecase.modifier,
      référencielPermissions.lauréat.actionnaire.command.modifier,
    ],
    consulterChangement: [
      référencielPermissions.lauréat.actionnaire.query.consulterChangement,
      référencielPermissions.lauréat.actionnaire.query.consulter,
    ],
    enregistrerChangement: [
      référencielPermissions.lauréat.actionnaire.usecase.enregistrerChangement,
      référencielPermissions.lauréat.actionnaire.command.enregistrerChangement,
    ],
    demanderChangement: [
      référencielPermissions.lauréat.actionnaire.usecase.demanderChangement,
      référencielPermissions.lauréat.actionnaire.command.demanderChangement,
    ],
    accorderChangement: [
      référencielPermissions.lauréat.actionnaire.usecase.accorderChangement,
      référencielPermissions.lauréat.actionnaire.command.accorderChangement,
    ],
    rejeterChangement: [
      référencielPermissions.lauréat.actionnaire.usecase.rejeterChangement,
      référencielPermissions.lauréat.actionnaire.command.rejeterChangement,
    ],
    annulerChangement: [
      référencielPermissions.lauréat.actionnaire.usecase.annulerChangement,
      référencielPermissions.lauréat.actionnaire.command.annulerChangement,
    ],
    listerChangement: [
      référencielPermissions.appelOffre.query.lister,
      référencielPermissions.lauréat.actionnaire.query.listerChangement,
    ],
  },
  puissance: {
    consulter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.puissance.query.consulter,
    ],
    listerChangement: [
      référencielPermissions.appelOffre.query.lister,
      référencielPermissions.lauréat.puissance.query.listerChangement,
    ],
    modifier: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.puissance.usecase.modifier,
      référencielPermissions.lauréat.puissance.command.modifier,
    ],
    consulterChangement: [
      référencielPermissions.lauréat.puissance.query.consulterChangement,
      référencielPermissions.lauréat.puissance.query.consulter,
    ],
    enregistrerChangement: [
      référencielPermissions.lauréat.puissance.usecase.enregistrerChangement,
      référencielPermissions.lauréat.puissance.command.enregistrerChangement,
    ],
    demanderChangement: [
      référencielPermissions.lauréat.puissance.usecase.demanderChangement,
      référencielPermissions.lauréat.puissance.command.demanderChangement,
      référencielPermissions.lauréat.puissance.query.consulterVolumeRéservé,
    ],
    annulerChangement: [
      référencielPermissions.lauréat.puissance.usecase.annulerChangement,
      référencielPermissions.lauréat.puissance.command.annulerChangement,
    ],
    accorderChangement: [
      référencielPermissions.lauréat.puissance.usecase.accorderChangement,
      référencielPermissions.lauréat.puissance.command.accorderChangement,
    ],
    rejeterChangement: [
      référencielPermissions.lauréat.puissance.usecase.rejeterChangement,
      référencielPermissions.lauréat.puissance.command.rejeterChangement,
    ],
  },
  producteur: {
    listerChangement: [référencielPermissions.lauréat.producteur.query.listerChangement],
    consulter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.producteur.query.consulter,
    ],
    consulterChangement: [référencielPermissions.lauréat.producteur.query.consulterChangement],
    modifier: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.producteur.usecase.modifier,
      référencielPermissions.lauréat.producteur.command.modifier,
    ],
    enregistrerChangement: [
      référencielPermissions.lauréat.producteur.usecase.enregistrerChangement,
      référencielPermissions.lauréat.producteur.command.enregistrerChangement,
      référencielPermissions.lauréat.garantiesFinancières.usecase.renouveler,
    ],
  },
  fournisseur: {
    listerChangement: [référencielPermissions.lauréat.fournisseur.query.listerChangement],
    consulter: [référencielPermissions.lauréat.fournisseur.query.consulter],
    consulterChangement: [référencielPermissions.lauréat.fournisseur.query.consulterChangement],
    modifierÉvaluationCarbone: [
      référencielPermissions.lauréat.fournisseur.command.modifierÉvaluationCarbone,
      référencielPermissions.lauréat.fournisseur.usecase.modifierÉvaluationCarbone,
    ],
    enregistrerChangement: [
      référencielPermissions.lauréat.fournisseur.usecase.enregistrerChangement,
      référencielPermissions.lauréat.fournisseur.command.enregistrerChangement,
      référencielPermissions.document.command.enregister,
    ],
    modifier: [
      référencielPermissions.lauréat.fournisseur.usecase.enregistrerChangement,
      référencielPermissions.lauréat.fournisseur.command.enregistrerChangement,
      référencielPermissions.document.command.enregister,
    ],
  },
  nomProjet: {
    listerChangement: [référencielPermissions.lauréat.nomProjet.query.listerChangement],
    consulterChangement: [
      référencielPermissions.lauréat.nomProjet.query.consulterChangement,
      référencielPermissions.lauréat.query.listerHistorique,
    ],
    modifier: [
      référencielPermissions.lauréat.query.consulter,
      référencielPermissions.lauréat.nomProjet.command.modifier,
      référencielPermissions.lauréat.nomProjet.usecase.modifier,
    ],
    enregistrerChangement: [
      référencielPermissions.lauréat.query.consulter,
      référencielPermissions.lauréat.nomProjet.command.enregistrerChangement,
      référencielPermissions.lauréat.nomProjet.usecase.enregistrerChangement,
      référencielPermissions.document.command.enregister,
    ],
  },
  lauréat: {
    consulter: [référencielPermissions.lauréat.query.consulter],
    lister: [
      référencielPermissions.lauréat.query.lister,
      référencielPermissions.appelOffre.query.lister,
    ],
    modifier: [
      référencielPermissions.lauréat.query.consulter,
      référencielPermissions.lauréat.command.modifierSiteDeProduction,
      référencielPermissions.lauréat.usecase.modifierSiteDeProduction,
      référencielPermissions.lauréat.nomProjet.command.modifier,
      référencielPermissions.lauréat.nomProjet.usecase.modifier,
    ],
    modifierSiteDeProduction: [
      référencielPermissions.lauréat.query.consulter,
      référencielPermissions.lauréat.command.modifierSiteDeProduction,
      référencielPermissions.lauréat.usecase.modifierSiteDeProduction,
    ],
  },
  éliminé: {
    consulter: [référencielPermissions.éliminé.query.consulter],
    lister: [
      référencielPermissions.éliminé.query.lister,
      référencielPermissions.appelOffre.query.lister,
    ],
  },
  accès: {
    consulter: [référencielPermissions.accès.query.consulter],
    lister: [référencielPermissions.accès.query.lister],
    listerProjetsÀRéclamer: [référencielPermissions.accès.query.listerProjetsÀRéclamer],
    autoriserAccèsProjet: [
      référencielPermissions.accès.command.autoriserAccèsProjet,
      référencielPermissions.accès.usecase.autoriserAccèsProjet,
    ],
    retirerAccèsProjet: [
      référencielPermissions.accès.command.retirerAccèsProjet,
      référencielPermissions.accès.usecase.retirerAccèsProjet,
    ],
    remplacerAccèsProjet: [
      référencielPermissions.accès.command.remplacerAccèsProjet,
      référencielPermissions.accès.usecase.remplacerAccèsProjet,
    ],
    réclamerProjet: [
      référencielPermissions.accès.command.réclamerProjet,
      référencielPermissions.accès.usecase.réclamerProjet,
    ],
  },
  utilisateur: {
    lister: [référencielPermissions.utilisateur.query.lister],
    inviter: [
      référencielPermissions.utilisateur.command.inviter,
      référencielPermissions.utilisateur.usecase.inviter,
      référencielPermissions.réseau.gestionnaire.query.lister,
    ],
    inviterPorteur: [
      référencielPermissions.utilisateur.command.inviterPorteur,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.utilisateur.usecase.inviterPorteur,
    ],
    désactiver: [
      référencielPermissions.utilisateur.command.désactiver,
      référencielPermissions.utilisateur.usecase.désactiver,
    ],
    réactiver: [
      référencielPermissions.utilisateur.command.réactiver,
      référencielPermissions.utilisateur.usecase.réactiver,
    ],
    modifierRôle: [
      référencielPermissions.utilisateur.command.modifierRôle,
      référencielPermissions.utilisateur.usecase.modifierRôle,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.réseau.gestionnaire.query.lister,
    ],
  },
  cahierDesCharges: {
    consulter: [référencielPermissions.lauréat.cahierDesCharges.query.consulter],
    choisir: [
      référencielPermissions.lauréat.délai.query.consulter,
      référencielPermissions.lauréat.cahierDesCharges.command.choisir,
      référencielPermissions.lauréat.cahierDesCharges.usecase.choisir,
    ],
  },
  délai: {
    consulterChangement: [
      référencielPermissions.lauréat.délai.query.consulterChangement,
      référencielPermissions.lauréat.délai.query.listerHistorique,
    ],
    listerChangement: [référencielPermissions.lauréat.délai.query.listerChangement],
    demanderChangement: [
      référencielPermissions.lauréat.délai.command.demanderChangement,
      référencielPermissions.lauréat.délai.usecase.demanderChangement,
      référencielPermissions.lauréat.délai.query.consulterChangement,
    ],
    annulerChangement: [
      référencielPermissions.lauréat.délai.command.annulerChangement,
      référencielPermissions.lauréat.délai.usecase.annulerChangement,
    ],
    passerDemandeEnInstruction: [
      référencielPermissions.lauréat.délai.command.passerEnInstruction,
      référencielPermissions.lauréat.délai.usecase.passerEnInstruction,
    ],
    reprendreInstructionDemande: [
      référencielPermissions.lauréat.délai.command.passerEnInstruction,
      référencielPermissions.lauréat.délai.usecase.passerEnInstruction,
    ],
    rejeterChangement: [
      référencielPermissions.lauréat.délai.command.rejeterChangement,
      référencielPermissions.lauréat.délai.usecase.rejeterChangement,
    ],
    accorderChangement: [
      référencielPermissions.lauréat.délai.command.accorderChangement,
      référencielPermissions.lauréat.délai.usecase.accorderChangement,
    ],
    corrigerChangement: [
      référencielPermissions.lauréat.délai.command.corrigerChangement,
      référencielPermissions.lauréat.délai.usecase.corrigerChangement,
    ],
  },
  api: {
    raccordement: {
      lister: [
        référencielPermissions.lauréat.raccordement.query.listerDossierRaccordement,
        référencielPermissions.lauréat.raccordement.query.listerDossierRaccordementManquants,
      ],
      transmettre: [
        référencielPermissions.lauréat.raccordement.usecase.transmettreDemandeComplète,
        référencielPermissions.lauréat.raccordement.command.transmettreDemandeComplète,
        référencielPermissions.lauréat.raccordement.usecase.transmettreDateMiseEnService,
        référencielPermissions.lauréat.raccordement.command.transmettreDateMiseEnService,
      ],
      modifier: [
        référencielPermissions.lauréat.raccordement.usecase.modifierRéférenceDossier,
        référencielPermissions.lauréat.raccordement.command.modifierRéférenceDossier,
      ],
    },
  },
  projet: {
    accèsDonnées: {
      prix: [],
    },
  },
  appelOffre: {
    consulter: [référencielPermissions.appelOffre.query.consulter],
  },
} as const;

/**
 * A utility type which returns a type union representing the paths to deepest properties of O
 * This is inspired from @see https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3
 * and @see https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
 */
type Leaves<O extends Record<string, unknown>> = {
  [K in Extract<keyof O, string>]: O[K] extends Array<unknown>
    ? K
    : O[K] extends Record<string, unknown>
      ? `${K}${Leaves<O[K]> extends never ? '' : `.${Leaves<O[K]>}`}`
      : K;
}[Extract<keyof O, string>];

export type Policy = Leaves<typeof policies>;

export type PolicyDomains = keyof typeof policies;

const commonPolicies: ReadonlyArray<Policy> = [
  'historique.lister',

  'appelOffre.consulter',
  'cahierDesCharges.consulter',

  // Header projet
  'lauréat.consulter',
  'éliminé.consulter',
  'abandon.consulter.détail',

  'lauréat.lister',
  'éliminé.lister',
];

// En attendant d'avoir des gateways qui groupent les query
const pageProjetPolicies: Policy[] = [
  ...commonPolicies,
  // Abandon
  'abandon.consulter.détail',

  // Recours
  'recours.consulter.détail',

  // Candidature
  'candidature.attestation.télécharger',

  // Représentant légal
  'représentantLégal.consulter',

  // Actionnaire
  'actionnaire.consulter',
  'actionnaire.consulterChangement',

  // Puissance
  'puissance.consulter',
  'puissance.consulterChangement',

  // Producteur
  'producteur.consulter',

  // Fournisseur
  'fournisseur.consulter',

  // Installation
  'installation.consulter',

  // Nature de l'exploitation
  'natureDeLExploitation.consulter',

  // Accès
  'accès.consulter',

  // Achèvement
  'achèvement.consulter',
];

const adminPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'projet.accèsDonnées.prix',

  // Historique
  'historique.imprimer',

  // Abandon
  'abandon.consulter.liste',
  'abandon.accorder',
  'abandon.rejeter',
  'abandon.demander-confirmation',
  'abandon.passer-en-instruction',

  // Recours
  'recours.consulter.liste',
  'recours.accorder',
  'recours.rejeter',
  'recours.passer-en-instruction',

  // Gestionnaire réseau
  'réseau.gestionnaire.lister',
  'réseau.gestionnaire.ajouter',
  'réseau.gestionnaire.modifier',

  // Raccordement
  'raccordement.consulter',
  'raccordement.gestionnaire.modifier',
  'raccordement.demande-complète-raccordement.transmettre',
  'raccordement.demande-complète-raccordement.modifier',
  'raccordement.proposition-technique-et-financière.transmettre',
  'raccordement.proposition-technique-et-financière.modifier',
  'raccordement.date-mise-en-service.transmettre',
  'raccordement.date-mise-en-service.modifier',
  'raccordement.date-mise-en-service.importer',
  'raccordement.référence-dossier.modifier',
  'raccordement.dossier.supprimer',
  'raccordement.listerDossierRaccordement',

  // Garanties financières
  'garantiesFinancières.archives.lister',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.enAttente.consulter',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.générerModèleMiseEnDemeure',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',

  // Attestation conformité
  'achèvement.transmettreAttestation',
  'achèvement.transmettreDate',
  'achèvement.modifier',

  // Candidature
  'candidature.consulter',
  'candidature.importer',
  'candidature.corriger',
  'candidature.lister',
  'candidature.attestation.prévisualiser',

  // Période
  'période.lister',
  'période.consulter',

  // Représentant légal
  'représentantLégal.modifier',
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',
  'représentantLégal.accorderChangement',
  'représentantLégal.rejeterChangement',

  // Actionnaire
  'actionnaire.modifier',
  'actionnaire.consulter',
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',
  'actionnaire.accorderChangement',
  'actionnaire.rejeterChangement',

  // Lauréat
  'lauréat.modifier',
  'lauréat.modifierSiteDeProduction',
  'nomProjet.modifier',
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',

  // Accès
  'accès.autoriserAccèsProjet',
  'accès.retirerAccèsProjet',
  'accès.remplacerAccèsProjet',
  'accès.consulter',
  'accès.lister',
  'accès.listerProjetsÀRéclamer',

  // Utilisateur
  'utilisateur.lister',
  'utilisateur.inviter',
  'utilisateur.inviterPorteur',
  'utilisateur.désactiver',
  'utilisateur.réactiver',
  'utilisateur.modifierRôle',

  // Puissance
  'puissance.modifier',
  'puissance.consulterChangement',
  'puissance.accorderChangement',
  'puissance.rejeterChangement',
  'puissance.listerChangement',

  // Producteur
  'producteur.listerChangement',
  'producteur.consulterChangement',
  'producteur.modifier',

  // Fournisseur
  'fournisseur.consulter',
  'fournisseur.modifierÉvaluationCarbone',
  'fournisseur.listerChangement',
  'fournisseur.consulterChangement',
  'fournisseur.modifier',

  // Délai
  'délai.consulterChangement',
  'délai.listerChangement',
  'délai.passerDemandeEnInstruction',
  'délai.reprendreInstructionDemande',
  'délai.rejeterChangement',
  'délai.accorderChangement',

  // installation
  'installation.installateur.modifier',
  'installation.typologieInstallation.modifier',
  'installation.dispositifDeStockage.modifier',
  'installation.installateur.consulterChangement',
  'installation.installateur.listerChangement',
  'installation.dispositifDeStockage.consulterChangement',
  'installation.dispositifDeStockage.listerChangement',

  // Nature de l'exploitation
  'natureDeLExploitation.modifier',
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.consulterChangement',
];

const dgecValidateurPolicies: ReadonlyArray<Policy> = [
  ...adminPolicies,

  // Abandon
  'abandon.preuve-recandidature.accorder',

  // Période
  'période.notifier',
];

const crePolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'projet.accèsDonnées.prix',

  // Abandon
  'abandon.consulter.liste',

  // Recours
  'recours.consulter.liste',

  // Gestionnaire réseau
  'réseau.gestionnaire.lister',

  // Raccordement
  'raccordement.consulter',
  'raccordement.listerDossierRaccordement',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.enAttente.consulter',

  // Actionnaire
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',

  // Représentant Légal
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',

  // Puissance
  'puissance.consulterChangement',
  'puissance.listerChangement',

  // Producteur
  'producteur.consulterChangement',
  'producteur.listerChangement',

  // Fournisseur
  'fournisseur.consulterChangement',
  'fournisseur.listerChangement',

  // Délai
  'délai.consulterChangement',
  'délai.listerChangement',

  // Nature de l'exploitation
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.consulterChangement',

  // installation
  'installation.installateur.consulterChangement',
  'installation.installateur.listerChangement',
  'installation.dispositifDeStockage.consulterChangement',
  'installation.dispositifDeStockage.listerChangement',

  // Nom Projet
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',
];

const drealPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'projet.accèsDonnées.prix',

  // Historique
  'historique.imprimer',

  // Abandon
  'abandon.consulter.liste',
  'abandon.accorder',
  'abandon.rejeter',
  'abandon.demander-confirmation',
  'abandon.passer-en-instruction',

  // Recours
  'recours.consulter.liste',

  // Raccordement
  'raccordement.consulter',
  'raccordement.listerDossierRaccordement',
  'raccordement.demande-complète-raccordement.transmettre',
  'raccordement.demande-complète-raccordement.modifier',
  'raccordement.proposition-technique-et-financière.transmettre',
  'raccordement.proposition-technique-et-financière.modifier',
  'raccordement.gestionnaire.modifier',

  // Garanties financières
  'garantiesFinancières.archives.lister',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.enAttente.consulter',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.générerModèleMiseEnDemeure',
  'garantiesFinancières.mainlevée.démarrerInstruction',
  'garantiesFinancières.mainlevée.accorder',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.mainlevée.rejeter',

  // Attestation conformité
  'achèvement.transmettreAttestation',
  'achèvement.modifier',

  // Candidature
  'candidature.attestation.télécharger',

  // Lauréat
  'lauréat.modifierSiteDeProduction',
  'nomProjet.modifier',
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',

  // Représentant légal
  'représentantLégal.modifier',
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',
  'représentantLégal.accorderChangement',
  'représentantLégal.rejeterChangement',

  // Actionnaire
  'actionnaire.modifier',
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',
  'actionnaire.accorderChangement',
  'actionnaire.rejeterChangement',

  // Puissance
  'puissance.modifier',
  'puissance.consulterChangement',
  'puissance.accorderChangement',
  'puissance.rejeterChangement',
  'puissance.listerChangement',

  // Accès
  'accès.autoriserAccèsProjet',
  'accès.retirerAccèsProjet',
  'accès.consulter',
  'accès.lister',
  'accès.listerProjetsÀRéclamer',

  // Utilisateur
  'utilisateur.inviterPorteur',

  // Producteur
  'producteur.modifier',
  'producteur.listerChangement',
  'producteur.consulterChangement',

  // Nature de l'exploitation
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.consulterChangement',

  // Fournisseur
  'fournisseur.listerChangement',
  'fournisseur.consulterChangement',
  'fournisseur.consulter',
  'fournisseur.modifier',

  // Délai
  'délai.consulterChangement',
  'délai.listerChangement',
  'délai.passerDemandeEnInstruction',
  'délai.reprendreInstructionDemande',
  'délai.rejeterChangement',
  'délai.accorderChangement',

  // installation
  'installation.installateur.modifier',
  'installation.typologieInstallation.modifier',
  'installation.dispositifDeStockage.modifier',
  'installation.installateur.consulterChangement',
  'installation.installateur.listerChangement',
  'installation.dispositifDeStockage.consulterChangement',
  'installation.dispositifDeStockage.listerChangement',

  // Nature de l'exploitation
  'natureDeLExploitation.modifier',
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.consulterChangement',
];

const porteurProjetPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'projet.accèsDonnées.prix',

  // Historique
  'historique.imprimer',

  // Abandon
  'abandon.consulter.liste',
  'abandon.demander',
  'abandon.annuler',
  'abandon.confirmer',
  'abandon.preuve-recandidature.transmettre',

  // Recours
  'recours.consulter.liste',
  'recours.demander',
  'recours.annuler',

  // Raccordement
  'raccordement.consulter',
  'raccordement.gestionnaire.modifier',
  'raccordement.demande-complète-raccordement.transmettre',
  'raccordement.demande-complète-raccordement.modifier',
  'raccordement.proposition-technique-et-financière.transmettre',
  'raccordement.proposition-technique-et-financière.modifier',
  'raccordement.référence-dossier.modifier',
  'raccordement.dossier.supprimer',

  // Tâche
  'tâche.consulter',

  // Garanties financières
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.soumettre',
  'garantiesFinancières.dépôt.supprimer',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.mainlevée.demander',
  'garantiesFinancières.mainlevée.annuler',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.consulter',

  // Attestation conformité
  'achèvement.transmettreAttestation',

  // Candidature
  'candidature.attestation.télécharger',

  // Représentant légal
  'représentantLégal.demanderChangement',
  'représentantLégal.annulerChangement',
  'représentantLégal.corrigerChangement',
  'représentantLégal.consulterChangement',
  'représentantLégal.enregistrerChangement',
  'représentantLégal.listerChangement',
  'représentantLégal.consulter',

  // Actionnaire
  'actionnaire.consulter',
  'actionnaire.consulterChangement',
  'actionnaire.enregistrerChangement',
  'actionnaire.demanderChangement',
  'actionnaire.annulerChangement',
  'actionnaire.listerChangement',

  // Puissance
  'puissance.consulter',
  'puissance.consulterChangement',
  'puissance.enregistrerChangement',
  'puissance.demanderChangement',
  'puissance.annulerChangement',
  'puissance.listerChangement',

  // Accès
  'accès.autoriserAccèsProjet',
  'accès.retirerAccèsProjet',
  'accès.réclamerProjet',
  'accès.consulter',
  'accès.lister',
  'accès.listerProjetsÀRéclamer',

  // Utilisateur
  'utilisateur.inviterPorteur',

  // Cahier des charges
  'cahierDesCharges.choisir',

  // Producteur
  'producteur.listerChangement',
  'producteur.enregistrerChangement',
  'producteur.consulterChangement',
  'producteur.consulter',

  // Fournisseur
  'fournisseur.enregistrerChangement',
  'fournisseur.listerChangement',
  'fournisseur.consulterChangement',
  'fournisseur.consulter',

  // Délai
  'délai.consulterChangement',
  'délai.listerChangement',
  'délai.demanderChangement',
  'délai.annulerChangement',
  'délai.corrigerChangement',

  // Nature de l'exploitation
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.enregistrerChangement',
  'natureDeLExploitation.consulterChangement',
  'natureDeLExploitation.consulter',

  // installation
  'installation.installateur.consulterChangement',
  'installation.installateur.listerChangement',
  'installation.installateur.enregistrerChangement',
  'installation.dispositifDeStockage.consulterChangement',
  'installation.dispositifDeStockage.listerChangement',
  'installation.dispositifDeStockage.enregistrerChangement',

  // Nom Projet
  'nomProjet.enregistrerChangement',
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',
];

const cocontractantPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'projet.accèsDonnées.prix',

  // Raccordement
  'raccordement.consulter',

  // Achèvement
  'achèvement.transmettreDate',

  // Actionnaire
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',

  // Représentant Légal
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',

  // Puissance
  'puissance.listerChangement',

  // Producteur
  'producteur.consulterChangement',
  'producteur.listerChangement',

  // Fournisseur
  'fournisseur.consulterChangement',
  'fournisseur.listerChangement',

  // Délai
  'délai.consulterChangement',
  'délai.listerChangement',

  // Nature de l'exploitation
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.consulterChangement',

  // installation
  'installation.installateur.consulterChangement',
  'installation.installateur.listerChangement',
  'installation.dispositifDeStockage.consulterChangement',
  'installation.dispositifDeStockage.listerChangement',

  // Nom Projet
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',
];

const caisseDesDépôtsPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.enAttente.consulter',
];

const grdPolicies: ReadonlyArray<Policy> = [
  'historique.lister',

  'appelOffre.consulter',
  'cahierDesCharges.consulter',

  // NB : cette permission est trop large pour juste afficher le header projet,
  // un refacto pour avoir une permission dédiée serait préférable
  'lauréat.consulter',

  // Gestionnaire réseau
  'réseau.gestionnaire.consulter',

  // Raccordement
  'raccordement.consulter',
  'raccordement.listerDossierRaccordement',
  'raccordement.date-mise-en-service.transmettre',
  'raccordement.date-mise-en-service.modifier',
  'raccordement.référence-dossier.modifier',

  'api.raccordement.lister',
  'api.raccordement.transmettre',
  'api.raccordement.modifier',
];

const ademePolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'projet.accèsDonnées.prix',
];

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
