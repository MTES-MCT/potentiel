import { référencielPermissions } from './référencielPermissions';

/**
 * A utility type which returns a type union representing the paths to deepest properties of O
 * This is inspired from @see https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3
 * and @see https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
 */
export type Leaves<O extends Record<string, unknown>> = {
  [K in Extract<keyof O, string>]: O[K] extends Array<unknown>
    ? K
    : O[K] extends Record<string, unknown>
      ? `${K}${Leaves<O[K]> extends never ? '' : `.${Leaves<O[K]>}`}`
      : K;
}[Extract<keyof O, string>];

export type Policy = Leaves<typeof policies>;

export const policies = {
  réseau: {
    raccordement: {
      listerDossierRaccordement: [
        référencielPermissions.réseau.raccordement.query
          .listerDossierRaccordementEnAttenteMiseEnService,
        référencielPermissions.réseau.raccordement.query.listerDossierRaccordement,
        référencielPermissions.appelOffre.query.lister,
      ],
      consulter: [
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.réseau.raccordement.query.consulter,
        référencielPermissions.réseau.raccordement.query.consulterNombre,
        référencielPermissions.réseau.raccordement.query.consulterDossier,
        référencielPermissions.document.query.consulter,
        référencielPermissions.réseau.gestionnaire.query.consulter,
      ],
      'demande-complète-raccordement': {
        transmettre: [
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.appelOffre.query.consulter,
          référencielPermissions.document.command.enregister,
          référencielPermissions.réseau.gestionnaire.query.lister,
          référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
          référencielPermissions.réseau.raccordement.usecase.transmettreDemandeComplète,
          référencielPermissions.réseau.raccordement.command.transmettreDemandeComplète,
        ],
        modifier: [
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.appelOffre.query.consulter,
          référencielPermissions.document.command.enregister,
          référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          référencielPermissions.réseau.raccordement.usecase.modifierDemandeComplète,
          référencielPermissions.réseau.raccordement.command.modifierDemandeComplète,
        ],
      },
      'proposition-technique-et-financière': {
        transmettre: [
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.document.command.enregister,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          référencielPermissions.réseau.raccordement.usecase
            .transmettrePropositionTechniqueEtFinancière,
          référencielPermissions.réseau.raccordement.command
            .transmettrePropositionTechniqueEtFinancière,
        ],
        modifier: [
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.document.command.enregister,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          référencielPermissions.réseau.raccordement.usecase
            .modifierPropostionTechniqueEtFinancière,
          référencielPermissions.réseau.raccordement.command
            .modifierPropostionTechniqueEtFinancière,
        ],
      },
      'date-mise-en-service': {
        transmettre: [
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.appelOffre.query.consulter,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          référencielPermissions.réseau.raccordement.usecase.transmettreDateMiseEnService,
          référencielPermissions.réseau.raccordement.command.transmettreDateMiseEnService,
        ],
        importer: [
          référencielPermissions.réseau.raccordement.query.rechercher,
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.réseau.raccordement.usecase.transmettreDateMiseEnService,
          référencielPermissions.réseau.raccordement.command.transmettreDateMiseEnService,
        ],
        modifier: [
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.appelOffre.query.consulter,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          // TODO ca devrait être modifierDateMiseEnService, mais pour le moment, la modification se fait va le même usecase
          référencielPermissions.réseau.raccordement.usecase.transmettreDateMiseEnService,
          référencielPermissions.réseau.raccordement.command.transmettreDateMiseEnService,
        ],
      },
      'référence-dossier': {
        modifier: [
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.appelOffre.query.consulter,
          référencielPermissions.document.command.déplacer,
          référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          référencielPermissions.réseau.raccordement.usecase.modifierRéférenceDossier,
          référencielPermissions.réseau.raccordement.command.modifierRéférenceDossier,
        ],
      },
      dossier: {
        supprimer: [
          référencielPermissions.réseau.raccordement.usecase.supprimerDossierDuRaccordement,
          référencielPermissions.réseau.raccordement.command.supprimerDossierDuRaccordement,
        ],
      },
      gestionnaire: {
        modifier: [
          référencielPermissions.candidature.query.consulterProjet,
          référencielPermissions.réseau.gestionnaire.query.lister,
          référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
          référencielPermissions.réseau.raccordement.usecase.modifierGestionnaireRéseau,
          référencielPermissions.réseau.raccordement.command.modifierGestionnaireRéseau,
        ],
      },
    },
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
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
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
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.accorder,
      référencielPermissions.lauréat.abandon.command.accorder,
    ],
    rejeter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
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
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
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
        référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.abandon.query.consulter,
        référencielPermissions.lauréat.abandon.usecase.accorder,
        référencielPermissions.lauréat.abandon.command.accorder,
      ],
    },
    'annuler-rejet': [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.annulerRejet,
      référencielPermissions.lauréat.abandon.command.annulerRejet,
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
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
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
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.éliminé.recours.query.consulter,
      référencielPermissions.éliminé.recours.usecase.accorder,
      référencielPermissions.éliminé.recours.command.accorder,
      référencielPermissions.éliminé.command.archiver,
    ],
    rejeter: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.éliminé.recours.query.consulter,
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.éliminé.recours.usecase.rejeter,
      référencielPermissions.éliminé.recours.command.rejeter,
    ],
  },
  tâche: {
    consulter: [
      référencielPermissions.tâche.query.consulterNombre,
      référencielPermissions.tâche.query.lister,
    ],
  },
  garantiesFinancières: {
    effacerHistorique: [
      référencielPermissions.lauréat.garantiesFinancières.usecase.effacerHistorique,
      référencielPermissions.lauréat.garantiesFinancières.command.effacerHistorique,
    ],
    dépôt: {
      consulter: [
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.garantiesFinancières.query
          .consulterDépôtEnCoursGarantiesFinancières,
      ],
      demander: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.demander,
        référencielPermissions.lauréat.garantiesFinancières.command.demander,
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
        référencielPermissions.lauréat.garantiesFinancières.query.listerDépôtsEnCours,
        référencielPermissions.appelOffre.query.lister,
      ],
    },
    archives: {
      consulter: [
        référencielPermissions.lauréat.garantiesFinancières.query
          .consulterArchivesGarantiesFinancières,
      ],
    },
    actuelles: {
      consulter: [
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.lauréat.garantiesFinancières.query
          .consulterGarantiesFinancièresActuelles,
      ],
      importer: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.importerType,
        référencielPermissions.lauréat.garantiesFinancières.command.importerType,
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
      annuler: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.annulerDemandeMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.annulerDemandeMainlevée,
      ],
      démarrerInstruction: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.démarrerInstructionMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.démarrerInstructionMainlevée,
      ],
      accorder: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.accorderDemandeMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.accorderDemandeMainlevée,
        référencielPermissions.document.command.enregister,
        référencielPermissions.document.command.corriger,
      ],
      rejeter: [
        référencielPermissions.lauréat.garantiesFinancières.usecase.rejeterDemandeMainlevée,
        référencielPermissions.lauréat.garantiesFinancières.command.rejeterDemandeMainlevée,
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
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.achèvement.query.consulter,
      référencielPermissions.document.query.consulter,
    ],
    transmettre: [
      référencielPermissions.lauréat.achèvement.useCase.transmettre,
      référencielPermissions.lauréat.achèvement.command.transmettre,
      référencielPermissions.document.command.enregister,
    ],
    modifier: [
      référencielPermissions.candidature.query.consulterProjet,
      référencielPermissions.lauréat.achèvement.query.consulter,
      référencielPermissions.lauréat.achèvement.useCase.modifier,
      référencielPermissions.lauréat.achèvement.command.modifier,
      référencielPermissions.document.command.enregister,
    ],
  },
  candidature: {
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
      référencielPermissions.candidature.query.listerProjets,
      référencielPermissions.appelOffre.query.lister,
    ],
    attestation: {
      prévisualiser: [
        référencielPermissions.utilisateur.query.consulter,
        référencielPermissions.candidature.query.consulterCandidature,
        référencielPermissions.appelOffre.query.consulter,
      ],
      télécharger: [
        référencielPermissions.lauréat.query.consulter,
        référencielPermissions.éliminé.query.consulter,
        référencielPermissions.document.query.consulter,
        référencielPermissions.candidature.query.consulterProjet,
        référencielPermissions.candidature.query.consulterCandidature,
        référencielPermissions.éliminé.recours.query.consulterLegacy,
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
      référencielPermissions.lauréat.usecase.notifier,
      référencielPermissions.lauréat.command.notifier,
      référencielPermissions.éliminé.usecase.notifier,
      référencielPermissions.éliminé.command.notifier,
      référencielPermissions.candidature.usecase.notifier,
      référencielPermissions.candidature.command.notifier,
    ],
  },
} as const;
