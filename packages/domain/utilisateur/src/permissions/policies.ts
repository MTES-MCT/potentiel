import { référencielPermissions } from './référentiel.js';

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

/**
 * Liste des droits fonctionnels, par domaine
 */
export const policies = {
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
    lister: {
      demandes: [
        référencielPermissions.lauréat.abandon.query.listerDemandes,
        référencielPermissions.appelOffre.query.lister,
      ],
    },
    consulter: {
      demande: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.candidature.query.listerProjetsPreuveRecandidature,
        référencielPermissions.lauréat.abandon.query.consulterDemande,
        référencielPermissions.document.query.consulter,
      ],
      enCours: [
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
      référencielPermissions.lauréat.abandon.query.consulterDemande,
      référencielPermissions.lauréat.abandon.usecase.annuler,
      référencielPermissions.lauréat.abandon.command.annuler,
    ],
    confirmer: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.abandon.query.consulterDemande,
      référencielPermissions.lauréat.abandon.usecase.confirmer,
      référencielPermissions.lauréat.abandon.command.confirmer,
    ],
    accorder: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.query.consulterDemande,
      référencielPermissions.lauréat.abandon.usecase.accorder,
      référencielPermissions.lauréat.abandon.command.accorder,
    ],
    rejeter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulterDemande,
      référencielPermissions.document.command.enregister,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.rejeter,
      référencielPermissions.lauréat.abandon.command.rejeter,
    ],
    'demander-confirmation': [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulterDemande,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.usecase.demanderConfirmation,
      référencielPermissions.lauréat.abandon.command.demanderConfirmation,
    ],
    'preuve-recandidature': {
      transmettre: [
        référencielPermissions.lauréat.abandon.query.consulterDemande,
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
        référencielPermissions.lauréat.abandon.query.consulterDemande,
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
        référencielPermissions.éliminé.recours.query.consulterDétailDemande,
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
      référencielPermissions.éliminé.recours.query.consulterDétailDemande,
      référencielPermissions.éliminé.recours.usecase.accorder,
      référencielPermissions.éliminé.recours.command.accorder,
    ],
    rejeter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.éliminé.recours.query.consulter,
      référencielPermissions.éliminé.recours.query.consulterDétailDemande,
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
    listerProjetAvecAchevementATransmettre: [
      référencielPermissions.lauréat.achèvement.query.listerProjetAvecAchevementATransmettre,
    ],
  },
  candidature: {
    consulter: [référencielPermissions.candidature.query.consulterCandidature],
    consulterDétail: [référencielPermissions.candidature.query.consulterDétailCandidature],
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
    listerDétailsFournisseur: [référencielPermissions.candidature.query.listerDétailsFournisseur],
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
      'modifier-après-mise-en-service': [],
      'modifier-après-achèvement': [],
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
      'modifier-après-mise-en-service': [],
      'modifier-après-achèvement': [],
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
      'supprimer-après-mise-en-service': [],
      'supprimer-après-achèvement': [],
    },
    gestionnaire: {
      modifier: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.réseau.gestionnaire.query.lister,
        référencielPermissions.lauréat.raccordement.query.consulterGestionnaireRéseau,
        référencielPermissions.lauréat.raccordement.usecase.modifierGestionnaireRéseau,
        référencielPermissions.lauréat.raccordement.command.modifierGestionnaireRéseau,
      ],
      'modifier-après-achèvement': [],
      'modifier-après-mise-en-service': [],
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
    listerLauréatEnrichi: [référencielPermissions.lauréat.query.listerLauréatEnrichi],
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
    listerÉliminéEnrichi: [référencielPermissions.éliminé.query.listerÉliminéEnrichi],
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
    consulterDemande: [
      référencielPermissions.lauréat.délai.query.consulterDemande,
      référencielPermissions.lauréat.délai.query.listerHistorique,
    ],
    listerDemandes: [référencielPermissions.lauréat.délai.query.listerDemandes],
    demander: [
      référencielPermissions.lauréat.délai.command.demander,
      référencielPermissions.lauréat.délai.usecase.demander,
      référencielPermissions.lauréat.délai.query.consulterDemande,
    ],
    annulerDemande: [
      référencielPermissions.lauréat.délai.command.annulerDemande,
      référencielPermissions.lauréat.délai.usecase.annulerDemande,
    ],
    passerDemandeEnInstruction: [
      référencielPermissions.lauréat.délai.command.passerEnInstruction,
      référencielPermissions.lauréat.délai.usecase.passerEnInstruction,
    ],
    reprendreInstructionDemande: [
      référencielPermissions.lauréat.délai.command.passerEnInstruction,
      référencielPermissions.lauréat.délai.usecase.passerEnInstruction,
    ],
    rejeterDemande: [
      référencielPermissions.lauréat.délai.command.rejeterDemande,
      référencielPermissions.lauréat.délai.usecase.rejeterDemande,
    ],
    accorderDemande: [
      référencielPermissions.lauréat.délai.command.accorderDemande,
      référencielPermissions.lauréat.délai.usecase.accorderDemande,
    ],
    corrigerDemande: [
      référencielPermissions.lauréat.délai.command.corrigerDemande,
      référencielPermissions.lauréat.délai.usecase.corrigerDemande,
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
  statistiquesDGEC: {
    consulter: [],
  },
} as const;
