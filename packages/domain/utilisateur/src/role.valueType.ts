import { OperationRejectedError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType =
  | 'admin'
  | 'porteur-projet'
  | 'dreal'
  | 'acheteur-obligé'
  | 'ademe'
  | 'dgec-validateur'
  | 'caisse-des-dépôts'
  | 'cre';

const roles: Array<RawType> = [
  'admin',
  'porteur-projet',
  'dreal',
  'acheteur-obligé',
  'ademe',
  'dgec-validateur',
  'caisse-des-dépôts',
  'cre',
];

export type ValueType = ReadonlyValueType<{
  nom: RawType;
  libellé(): string;
  vérifierLaPermission(value: string): void;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    nom: value,
    estÉgaleÀ(valueType) {
      return valueType.nom === this.nom;
    },
    libellé() {
      return this.nom.replace('-', ' ').toLocaleUpperCase();
    },
    vérifierLaPermission(permission) {
      const aLaPermission = permissions[this.nom].includes(permission);

      if (!aLaPermission) {
        throw new AccèsFonctionnalitéRefuséError(permission, this.nom);
      }
    },
  };
};

export const estUnRoleValide = (value: string) => {
  return (roles as Array<string>).includes(value);
};

function estValide(value: string): asserts value is RawType {
  const isValid = estUnRoleValide(value);

  if (!isValid) {
    throw new RoleRefuséError(value);
  }
}

export const porteur = convertirEnValueType('porteur-projet');
export const admin = convertirEnValueType('admin');
export const dgecValidateur = convertirEnValueType('dgec-validateur');
export const dreal = convertirEnValueType('dreal');
export const cre = convertirEnValueType('cre');
export const acheteurObligé = convertirEnValueType('acheteur-obligé');

class RoleRefuséError extends OperationRejectedError {
  constructor(value: string) {
    super(`Le role ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class AccèsFonctionnalitéRefuséError extends OperationRejectedError {
  constructor(fonctionnalité: string, role: string) {
    super(`Accès à la fonctionnalité refusé`, {
      fonctionnalité,
      role,
    });
  }
}

// MATRICE en mémoire en attendant de pouvoir gérer les permissions depuis une interface d'administration
const référencielPermissions = {
  lauréat: {
    abandon: {
      query: {
        consulter: 'Lauréat.Abandon.Query.ConsulterAbandon',
        lister: 'Lauréat.Abandon.Query.ListerAbandons',
        détecter: 'Lauréat.Abandon.Query.DétecterAbandon',
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
        consulter: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        lister: 'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancières',
      },
      usecase: {
        demander: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
        soumettre: 'Lauréat.GarantiesFinancières.UseCase.SoumettreGarantiesFinancières',
        supprimerGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
        valider: 'Lauréat.GarantiesFinancières.UseCase.ValiderGarantiesFinancières',
        modifierGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancièresÀTraiter',
      },
      command: {
        demander: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
        soumettre: 'Lauréat.GarantiesFinancières.Command.SoumettreGarantiesFinancières',
        supprimerGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.Command.SupprimerGarantiesFinancièresÀTraiter',
        valider: 'Lauréat.GarantiesFinancières.Command.ValiderGarantiesFinancières',
        modifierGarantiesFinancièresÀTraiter:
          'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancièresÀTraiter',
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
      consulter: 'Candidature.Query.ConsulterCandidature',
      listerCandidaturesPreuveRecandidature:
        'Candidature.Query.ListerCandidaturesEligiblesPreuveRecandidature',
    },
  },
  document: {
    query: {
      consulter: 'Document.Query.ConsulterDocumentProjet',
      générerModèleRéponse: 'Document.Query.GénérerModèleRéponseAbandon',
    },
    command: {
      enregister: 'Document.Command.EnregistrerDocumentProjet',
      déplacer: 'Document.Command.DéplacerDocumentProjet',
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
        rechercher: 'Réseau.Raccordement.Query.RechercherDossierRaccordement',
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
    command: {
      ajouter: 'Tâche.Command.AjouterTâche',
      achever: 'Tâche.Command.AcheverTâche',
    },
  },
} as const;

const policies = {
  réseau: {
    raccordement: {
      consulter: [
        référencielPermissions.candidature.query.consulter,
        référencielPermissions.réseau.raccordement.query.consulter,
        référencielPermissions.document.query.consulter,
        référencielPermissions.réseau.raccordement.query.consulterDossier,
        référencielPermissions.réseau.gestionnaire.query.consulter,
      ],
      'demande-complète-raccordement': {
        transmettre: [
          référencielPermissions.candidature.query.consulter,
          référencielPermissions.appelOffre.query.consulter,
          référencielPermissions.document.command.enregister,
          référencielPermissions.réseau.gestionnaire.query.lister,
          référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
          référencielPermissions.réseau.raccordement.usecase.transmettreDemandeComplète,
          référencielPermissions.réseau.raccordement.command.transmettreDemandeComplète,
        ],
        modifier: [
          référencielPermissions.candidature.query.consulter,
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
          référencielPermissions.candidature.query.consulter,
          référencielPermissions.document.command.enregister,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          référencielPermissions.réseau.raccordement.usecase
            .transmettrePropositionTechniqueEtFinancière,
          référencielPermissions.réseau.raccordement.command
            .transmettrePropositionTechniqueEtFinancière,
        ],
        modifier: [
          référencielPermissions.candidature.query.consulter,
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
          référencielPermissions.candidature.query.consulter,
          référencielPermissions.appelOffre.query.consulter,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          référencielPermissions.réseau.raccordement.usecase.transmettreDateMiseEnService,
          référencielPermissions.réseau.raccordement.command.transmettreDateMiseEnService,
        ],
        importer: [
          référencielPermissions.réseau.raccordement.query.rechercher,
          référencielPermissions.candidature.query.consulter,
          référencielPermissions.réseau.raccordement.usecase.transmettreDateMiseEnService,
          référencielPermissions.réseau.raccordement.command.transmettreDateMiseEnService,
        ],
      },
      'référence-dossier': {
        modifier: [
          référencielPermissions.candidature.query.consulter,
          référencielPermissions.appelOffre.query.consulter,
          référencielPermissions.document.command.déplacer,
          référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
          référencielPermissions.réseau.raccordement.query.consulterDossier,
          référencielPermissions.réseau.raccordement.usecase.modifierRéférenceDossier,
          référencielPermissions.réseau.raccordement.command.modifierRéférenceDossier,
        ],
      },
      gestionnaire: {
        modifier: [
          référencielPermissions.candidature.query.consulter,
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
    },
  },
  abandon: {
    consulter: {
      liste: [
        référencielPermissions.lauréat.abandon.query.lister,
        référencielPermissions.appelOffre.query.lister,
      ],
      détail: [
        référencielPermissions.candidature.query.consulter,
        référencielPermissions.lauréat.abandon.query.consulter,
        référencielPermissions.document.query.consulter,
        // permission for legacy detection (project page)
        référencielPermissions.lauréat.abandon.query.détecter,
      ],
    },
    demander: [
      référencielPermissions.candidature.query.consulter,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.usecase.demander,
      référencielPermissions.lauréat.abandon.command.demander,
    ],
    annuler: [
      référencielPermissions.candidature.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.annuler,
      référencielPermissions.lauréat.abandon.command.annuler,
    ],
    confirmer: [
      référencielPermissions.candidature.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.confirmer,
      référencielPermissions.lauréat.abandon.command.confirmer,
    ],
    accorder: [
      référencielPermissions.candidature.query.consulter,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.document.query.générerModèleRéponse,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.accorder,
      référencielPermissions.lauréat.abandon.command.accorder,
    ],
    rejeter: [
      référencielPermissions.candidature.query.consulter,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.document.query.générerModèleRéponse,
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.rejeter,
      référencielPermissions.lauréat.abandon.command.rejeter,
    ],
    'demander-confirmation': [
      référencielPermissions.candidature.query.consulter,
      référencielPermissions.appelOffre.query.consulter,
      référencielPermissions.utilisateur.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.document.query.générerModèleRéponse,
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
      référencielPermissions.document.command.enregister,
      référencielPermissions.lauréat.abandon.usecase.demanderConfirmation,
      référencielPermissions.lauréat.abandon.command.demanderConfirmation,
    ],
    'preuve-recandidature': {
      transmettre: [
        référencielPermissions.lauréat.abandon.query.consulter,
        référencielPermissions.candidature.query.consulter,
        référencielPermissions.candidature.query.listerCandidaturesPreuveRecandidature,
        référencielPermissions.lauréat.abandon.usecase.transmettrePreuveRecandidature,
        référencielPermissions.lauréat.abandon.command.transmettrePreuveRecandidature,
      ],
      accorder: [
        référencielPermissions.candidature.query.consulter,
        référencielPermissions.appelOffre.query.consulter,
        référencielPermissions.utilisateur.query.consulter,
        référencielPermissions.utilisateur.query.consulter,
        référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
        référencielPermissions.document.query.générerModèleRéponse,
        référencielPermissions.document.command.enregister,
        référencielPermissions.lauréat.abandon.query.consulter,
        référencielPermissions.lauréat.abandon.usecase.accorder,
        référencielPermissions.lauréat.abandon.command.accorder,
      ],
    },
    'annuler-rejet': [
      référencielPermissions.candidature.query.consulter,
      référencielPermissions.lauréat.abandon.query.consulter,
      référencielPermissions.lauréat.abandon.usecase.annulerRejet,
      référencielPermissions.lauréat.abandon.command.annulerRejet,
    ],
  },
  tâche: {
    consulter: [
      référencielPermissions.tâche.query.consulterNombre,
      référencielPermissions.tâche.query.lister,
    ],
    ajouter: [référencielPermissions.tâche.command.ajouter],
    achever: [référencielPermissions.tâche.command.achever],
  },
  garantiesFinancières: {
    consulter: [référencielPermissions.lauréat.garantiesFinancières.query.consulter],
    lister: [référencielPermissions.lauréat.garantiesFinancières.query.lister],
    demander: [
      référencielPermissions.lauréat.garantiesFinancières.usecase.demander,
      référencielPermissions.lauréat.garantiesFinancières.command.demander,
    ],
    soumettre: [
      référencielPermissions.candidature.query.consulter,
      référencielPermissions.lauréat.garantiesFinancières.usecase.soumettre,
      référencielPermissions.lauréat.garantiesFinancières.command.soumettre,
      référencielPermissions.document.command.enregister,
    ],
    valider: [
      référencielPermissions.lauréat.garantiesFinancières.usecase.valider,
      référencielPermissions.lauréat.garantiesFinancières.command.valider,
      référencielPermissions.document.command.déplacer,
    ],
    'supprimer-garanties-financières-à-traiter': [
      référencielPermissions.lauréat.garantiesFinancières.usecase
        .supprimerGarantiesFinancièresÀTraiter,
      référencielPermissions.lauréat.garantiesFinancières.command
        .supprimerGarantiesFinancièresÀTraiter,
      référencielPermissions.lauréat.garantiesFinancières.query.consulter,
    ],
    'modifier-garanties-financières-à-traiter': [
      référencielPermissions.lauréat.garantiesFinancières.usecase
        .modifierGarantiesFinancièresÀTraiter,
      référencielPermissions.lauréat.garantiesFinancières.command
        .modifierGarantiesFinancièresÀTraiter,
      référencielPermissions.document.command.enregister,
    ],
  },
};

const permissionAdmin = [
  // Abandon
  ...policies.abandon.consulter.liste,
  ...policies.abandon.consulter.détail,
  ...policies.abandon.accorder,
  ...policies.abandon.rejeter,
  ...policies.abandon['demander-confirmation'],
  ...policies.abandon['annuler-rejet'],

  // Gestionnaire réseau
  ...policies.réseau.gestionnaire.lister,
  ...policies.réseau.gestionnaire.ajouter,
  ...policies.réseau.gestionnaire.modifier,

  // Raccordement
  ...policies.réseau.raccordement.consulter,
  ...policies.réseau.raccordement.gestionnaire.modifier,
  ...policies.réseau.raccordement['demande-complète-raccordement'].transmettre,
  ...policies.réseau.raccordement['demande-complète-raccordement'].modifier,
  ...policies.réseau.raccordement['proposition-technique-et-financière'].transmettre,
  ...policies.réseau.raccordement['proposition-technique-et-financière'].modifier,
  ...policies.réseau.raccordement['date-mise-en-service'].transmettre,
  ...policies.réseau.raccordement['date-mise-en-service'].importer,
  ...policies.réseau.raccordement['référence-dossier'].modifier,

  // Tâche
  ...policies.tâche.ajouter,
  ...policies.tâche.achever,

  // Garanties financières
  ...policies.garantiesFinancières.consulter,
  ...policies.garantiesFinancières.lister,
  ...policies.garantiesFinancières.demander,
  ...policies.garantiesFinancières.valider,
  ...policies.garantiesFinancières['modifier-garanties-financières-à-traiter'],
];

const permissionCRE = [
  // Abandon
  ...policies.abandon.consulter.liste,
  ...policies.abandon.consulter.détail,

  // Raccordement
  ...policies.réseau.raccordement.consulter,

  // Garanties financières
  ...policies.garantiesFinancières.consulter,
  ...policies.garantiesFinancières.lister,
];

const permissionDreal = [
  // Abandon
  ...policies.abandon.consulter.liste,
  ...policies.abandon.consulter.détail,

  // Raccordement
  ...policies.réseau.raccordement.consulter,

  // Garanties financières
  ...policies.garantiesFinancières.consulter,
  ...policies.garantiesFinancières.lister,
  ...policies.garantiesFinancières.demander,
  ...policies.garantiesFinancières.valider,
  ...policies.garantiesFinancières['modifier-garanties-financières-à-traiter'],
];

const permissionDgecValidateur = [
  // Abandon
  ...policies.abandon.consulter.liste,
  ...policies.abandon.consulter.détail,
  ...policies.abandon.accorder,
  ...policies.abandon.rejeter,
  ...policies.abandon['preuve-recandidature'].accorder,
  ...policies.abandon['demander-confirmation'],
  ...policies.abandon['annuler-rejet'],

  // Gestionnaire réseau
  ...policies.réseau.gestionnaire.lister,
  ...policies.réseau.gestionnaire.ajouter,
  ...policies.réseau.gestionnaire.modifier,

  // Raccordement
  ...policies.réseau.raccordement.consulter,
  ...policies.réseau.raccordement.gestionnaire.modifier,
  ...policies.réseau.raccordement['demande-complète-raccordement'].transmettre,
  ...policies.réseau.raccordement['demande-complète-raccordement'].modifier,
  ...policies.réseau.raccordement['proposition-technique-et-financière'].transmettre,
  ...policies.réseau.raccordement['proposition-technique-et-financière'].modifier,
  ...policies.réseau.raccordement['date-mise-en-service'].transmettre,
  ...policies.réseau.raccordement['date-mise-en-service'].importer,
  ...policies.réseau.raccordement['référence-dossier'].modifier,

  // Garanties financières
  ...policies.garantiesFinancières.consulter,
  ...policies.garantiesFinancières.lister,
  ...policies.garantiesFinancières.demander,
  ...policies.garantiesFinancières.valider,
];

const permissionPorteurProjet = [
  // Abandon
  ...policies.abandon.consulter.liste,
  ...policies.abandon.consulter.détail,
  ...policies.abandon.demander,
  ...policies.abandon.annuler,
  ...policies.abandon.confirmer,
  ...policies.abandon['preuve-recandidature'].transmettre,

  // Raccordement
  ...policies.réseau.raccordement.consulter,
  ...policies.réseau.raccordement.gestionnaire.modifier,
  ...policies.réseau.raccordement['demande-complète-raccordement'].transmettre,
  ...policies.réseau.raccordement['demande-complète-raccordement'].modifier,
  ...policies.réseau.raccordement['proposition-technique-et-financière'].transmettre,
  ...policies.réseau.raccordement['proposition-technique-et-financière'].modifier,
  ...policies.réseau.raccordement['référence-dossier'].modifier,

  // Tâche
  ...policies.tâche.consulter,
  ...policies.tâche.ajouter,
  ...policies.tâche.achever,

  // Garanties financières
  ...policies.garantiesFinancières.consulter,
  ...policies.garantiesFinancières.lister,
  ...policies.garantiesFinancières.demander,
  ...policies.garantiesFinancières.valider,
  ...policies.garantiesFinancières.soumettre,
  ...policies.garantiesFinancières['supprimer-garanties-financières-à-traiter'],
  ...policies.garantiesFinancières['modifier-garanties-financières-à-traiter'],
];

const permissionAcheteurObligé = [
  ...policies.réseau.raccordement.consulter,

  // Garanties financières
  ...policies.garantiesFinancières.consulter,
  ...policies.garantiesFinancières.lister,
];

const permissionCaisseDesDépôts = [
  // Garanties financières
  ...policies.garantiesFinancières.consulter,
  ...policies.garantiesFinancières.lister,
];

const permissions: Record<RawType, string[]> = {
  admin: [...new Set(permissionAdmin)],
  'acheteur-obligé': [...new Set(permissionAcheteurObligé)],
  ademe: [],
  'caisse-des-dépôts': [...new Set(permissionCaisseDesDépôts)],
  cre: [...new Set(permissionCRE)],
  dreal: [...new Set(permissionDreal)],
  'dgec-validateur': [...new Set(permissionDgecValidateur)],
  'porteur-projet': [...new Set(permissionPorteurProjet)],
};
