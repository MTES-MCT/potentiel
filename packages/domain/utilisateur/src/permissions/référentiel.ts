// MATRICE en mémoire en attendant de pouvoir gérer les permissions depuis une interface d'administration
/**
 * Mapping entre les droits fonctionnels et le type de message mediator
 */
export const référencielPermissions = {
  lauréat: {
    abandon: {
      query: {
        consulter: 'Lauréat.Abandon.Query.ConsulterAbandon',
        consulterDemande: 'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
        listerDemandes: 'Lauréat.Abandon.Query.ListerDemandesAbandon',
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
        listerProjetAvecAchevementATransmettre:
          'Lauréat.Achevement.Query.ListerProjetAvecAchevementATransmettre',
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
        consulterDemande: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
        listerDemandes: 'Lauréat.Délai.Query.ListerDemandeDélai',
        listerHistorique: 'Lauréat.Délai.Query.ListerHistoriqueDélaiProjet',
      },
      usecase: {
        demander: 'Lauréat.Délai.UseCase.DemanderDélai',
        annulerDemande: 'Lauréat.Délai.UseCase.AnnulerDemande',
        passerEnInstruction: 'Lauréat.Délai.UseCase.PasserEnInstructionDemande',
        rejeterDemande: 'Lauréat.Délai.UseCase.RejeterDemandeDélai',
        accorderDemande: 'Lauréat.Délai.UseCase.AccorderDemandeDélai',
        corrigerDemande: 'Lauréat.Délai.UseCase.CorrigerDemandeDélai',
      },
      command: {
        demander: 'Lauréat.Délai.Command.DemanderDélai',
        annulerDemande: 'Lauréat.Délai.Command.AnnulerDemande',
        passerEnInstruction: 'Lauréat.Délai.Command.PasserEnInstructionDemande',
        rejeterDemande: 'Lauréat.Délai.Command.RejeterDemandeDélai',
        accorderDemande: 'Lauréat.Délai.Command.AccorderDemandeDélai',
        corrigerDemande: 'Lauréat.Délai.Command.CorrigerDemandeDélai',
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
      listerLauréatEnrichi: 'Lauréat.Query.ListerLauréatEnrichi',
    },
  },
  éliminé: {
    query: {
      consulter: 'Éliminé.Query.ConsulterÉliminé',
      lister: 'Éliminé.Query.ListerÉliminé',
      listerÉliminéEnrichi: 'Éliminé.Query.ListerÉliminéEnrichi',
    },
    command: {
      notifier: 'Éliminé.Command.NotifierÉliminé',
    },
    recours: {
      query: {
        consulter: 'Éliminé.Recours.Query.ConsulterRecours',
        consulterDétailDemande: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
        lister: 'Éliminé.Recours.Query.ListerDemandeRecours',
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
      consulterDétailCandidature: 'Candidature.Query.ConsulterDétailCandidature',
      consulterProjet: 'Candidature.Query.ConsulterProjet',
      listerProjetsPreuveRecandidature:
        'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
      listerCandidatures: 'Candidature.Query.ListerCandidatures',
      listerDétailsFournisseur: 'Candidature.Query.ListerDétailsFournisseur',
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
