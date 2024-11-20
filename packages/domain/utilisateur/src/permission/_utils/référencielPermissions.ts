// MATRICE en mémoire en attendant de pouvoir gérer les permissions depuis une interface d'administration
/**
 * Mapping entre les droits fonctionnels et le type de message mediator
 */
export const référencielPermissions = {
  lauréat: {
    abandon: {
      query: {
        consulter: 'Lauréat.Abandon.Query.ConsulterAbandon',
        lister: 'Lauréat.Abandon.Query.ListerAbandons',
      },
      usecase: {
        annuler: 'Lauréat.Abandon.UseCase.AnnulerAbandon',
        confirmer: 'Lauréat.Abandon.UseCase.ConfirmerAbandon',
        demander: 'Lauréat.Abandon.UseCase.DemanderAbandon',
        transmettrePreuveRecandidature:
          'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
        accorder: 'Lauréat.Abandon.UseCase.AccorderAbandon',
        annulerRejet: 'Lauréat.Abandon.UseCase.AnnulerRejetAbandon',
        demanderConfirmation: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
        rejeter: 'Lauréat.Abandon.UseCase.RejeterAbandon',
      },
      command: {
        annuler: 'Lauréat.Abandon.Command.AnnulerAbandon',
        confirmer: 'Lauréat.Abandon.Command.ConfirmerAbandon',
        demander: 'Lauréat.Abandon.Command.DemanderAbandon',
        transmettrePreuveRecandidature:
          'Lauréat.Abandon.Command.TransmettrePreuveRecandidatureAbandon',
        accorder: 'Lauréat.Abandon.Command.AccorderAbandon',
        annulerRejet: 'Lauréat.Abandon.Command.AnnulerRejetAbandon',
        demanderConfirmation: 'Lauréat.Abandon.Command.DemanderConfirmationAbandon',
        rejeter: 'Lauréat.Abandon.Command.RejeterAbandon',
      },
    },
    garantiesFinancières: {
      query: {
        consulterGarantiesFinancièresActuelles:
          'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        consulterArchivesGarantiesFinancières:
          'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
        consulterDépôtEnCoursGarantiesFinancières:
          'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
        listerDépôtsEnCours:
          'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
        listerProjetsAvecGarantiesFinancièresEnAttente:
          'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
        consulterProjetAvecGarantiesFinancièresEnAttente:
          'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
        listerMainlevée: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
      },
      usecase: {
        demander: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
        soumettre: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
        supprimerGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
        valider: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
        modifierGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
        importerType: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
        modifier: 'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
        enregistrerAttestation: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
        enregistrer: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
        effacerHistorique:
          'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
        demanderMainlevée: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
        annulerDemandeMainlevée: 'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Annuler',
        démarrerInstructionMainlevée:
          'Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction',
        accorderDemandeMainlevée:
          'Lauréat.GarantiesFinancières.Mainlevée.UseCase.AccorderDemandeMainlevée',
        rejeterDemandeMainlevée:
          'Lauréat.GarantiesFinancières.Mainlevée.UseCase.RejeterDemandeMainlevée',
      },
      command: {
        demander: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
        soumettre: 'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
        supprimerGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancièresEnCours',
        valider: 'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
        modifierGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
        importerType: 'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
        modifier: 'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
        enregistrerAttestation: 'Lauréat.GarantiesFinancières.Command.EnregistrerAttestation',
        enregistrer: 'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
        effacerHistorique:
          'Lauréat.GarantiesFinancières.Command.EffacerHistoriqueGarantiesFinancières',
        demanderMainlevée: 'Lauréat.GarantiesFinancières.Mainlevée.Command.Demander',
        annulerDemandeMainlevée: 'Lauréat.GarantiesFinancières.Mainlevée.Command.Annuler',
        démarrerInstructionMainlevée:
          'Lauréat.GarantiesFinancières.Mainlevée.Command.DémarrerInstruction',
        accorderDemandeMainlevée:
          'Lauréat.GarantiesFinancières.Mainlevée.Command.AccorderDemandeMainlevée',
        rejeterDemandeMainlevée:
          'Lauréat.GarantiesFinancières.Mainlevée.Command.RejeterDemandeMainlevée',
      },
    },
    achèvement: {
      query: {
        consulter: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
      },
      command: {
        transmettre:
          'Lauréat.Achèvement.AttestationConformité.Command.TransmettreAttestationConformité',
        modifier: 'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
      },
      useCase: {
        transmettre:
          'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
        modifier: 'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
      },
    },
    usecase: { notifier: 'Lauréat.UseCase.NotifierLauréat' },
    command: { notifier: 'Lauréat.Command.NotifierLauréat' },
    query: { consulter: 'Lauréat.Query.ConsulterLauréat' },
  },
  éliminé: {
    query: { consulter: 'Éliminé.Query.ConsulterÉliminé' },
    usecase: { notifier: 'Éliminé.UseCase.NotifierÉliminé' },
    command: {
      notifier: 'Éliminé.Command.NotifierÉliminé',
      archiver: 'Éliminé.Recours.Command.ArchiverÉliminé',
    },
    recours: {
      query: {
        consulterLegacy: 'Éliminé.Recours.Query.ConsulterDemandeRecoursLegacy',
        consulter: 'Éliminé.Recours.Query.ConsulterRecours',
        lister: 'Éliminé.Recours.Query.ListerRecours',
      },
      usecase: {
        annuler: 'Éliminé.Recours.UseCase.AnnulerRecours',
        demander: 'Éliminé.Recours.UseCase.DemanderRecours',
        accorder: 'Éliminé.Recours.UseCase.AccorderRecours',
        rejeter: 'Éliminé.Recours.UseCase.RejeterRecours',
      },
      command: {
        annuler: 'Éliminé.Recours.Command.AnnulerRecours',
        demander: 'Éliminé.Recours.Command.DemanderRecours',
        accorder: 'Éliminé.Recours.Command.AccorderRecours',
        rejeter: 'Éliminé.Recours.Command.RejeterRecours',
      },
    },
  },
  appelOffre: {
    cahierDesCharges: {
      query: {
        consulter: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
      },
    },
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
      listerProjets: 'Candidature.Query.ListerProjets',
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
    raccordement: {
      query: {
        consulter: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        consulterDossier: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        consulterGestionnaireRéseau:
          'Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
        consulterNombre: 'Réseau.Raccordement.Query.ConsulterNombreDeRaccordement',
        rechercher: 'Réseau.Raccordement.Query.RechercherDossierRaccordement',
        lister: 'Réseau.Raccordement.Query.ListerRaccordement',
        listerDossierRaccordementEnAttenteMiseEnService:
          'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
        listerDossierRaccordement: 'Réseau.Raccordement.Query.ListerDossierRaccordementQuery',
      },
      usecase: {
        modifierDemandeComplète: 'Réseau.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
        modifierGestionnaireRéseau:
          'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
        modifierPropostionTechniqueEtFinancière:
          'Réseau.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
        modifierRéférenceDossier:
          'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
        transmettreDateMiseEnService: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
        transmettreDemandeComplète:
          'Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
        transmettrePropositionTechniqueEtFinancière:
          'Réseau.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
        supprimerDossierDuRaccordement:
          'Réseau.Raccordement.UseCase.SupprimerDossierDuRaccordement',
      },
      command: {
        modifierDemandeComplète: 'Réseau.Raccordement.Command.ModifierDemandeComplèteRaccordement',
        modifierGestionnaireRéseau:
          'Réseau.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
        modifierPropostionTechniqueEtFinancière:
          'Réseau.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
        modifierRéférenceDossier:
          'Réseau.Raccordement.Command.ModifierRéférenceDossierRaccordement',
        transmettreDateMiseEnService: 'Réseau.Raccordement.Command.TransmettreDateMiseEnService',
        transmettreDemandeComplète:
          'Réseau.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
        transmettrePropositionTechniqueEtFinancière:
          'Réseau.Raccordement.Command.TransmettrePropositionTechniqueEtFinancière',
        supprimerDossierDuRaccordement:
          'Réseau.Raccordement.Command.SupprimerDossierDuRaccordement',
      },
    },
  },
  utilisateur: {
    query: {
      consulter: 'Utilisateur.Query.ConsulterUtilisateur',
    },
  },
  tâche: {
    query: {
      consulterNombre: 'Tâche.Query.ConsulterNombreTâches',
      lister: 'Tâche.Query.ListerTâches',
    },
  },
} as const;
