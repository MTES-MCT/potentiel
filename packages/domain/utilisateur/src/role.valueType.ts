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
        consulter: 'CONSULTER_ABANDON_QUERY',
        lister: 'LISTER_ABANDONS_QUERY',
        détecter: 'DÉTECTER_ABANDON_QUERY',
      },
      usecase: {
        annuler: 'ANNULER_ABANDON_USECASE',
        confirmer: 'CONFIRMER_ABANDON_USECASE',
        demander: 'DEMANDER_ABANDON_USECASE',
        transmettrePreuveRecandidature: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
        accorder: 'ACCORDER_ABANDON_USECASE',
        annulerRejet: 'ANNULER_REJET_ABANDON_USECASE',
        demanderConfirmation: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
        rejeter: 'REJETER_ABANDON_USECASE',
      },
      command: {
        annuler: 'ANNULER_ABANDON_COMMAND',
        confirmer: 'CONFIRMER_ABANDON_COMMAND',
        demander: 'DEMANDER_ABANDON_COMMAND',
        transmettrePreuveRecandidature: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_COMMAND',
        accorder: 'ACCORDER_ABANDON_COMMAND',
        annulerRejet: 'ANNULER_REJET_ABANDON_COMMAND',
        demanderConfirmation: 'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
        rejeter: 'REJETER_ABANDON_COMMAND',
      },
    },
  },
  appelOffre: {
    cahierDesCharges: {
      query: {
        consulter: 'CONSULTER_CAHIER_DES_CHARGES_QUERY',
      },
    },
    query: {
      consulter: 'CONSULTER_APPEL_OFFRE_QUERY',
      lister: 'LISTER_APPEL_OFFRE_QUERY',
    },
  },
  candidature: {
    query: {
      consulter: 'CONSULTER_CANDIDATURE_QUERY',
      listerCandidaturesPreuveRecandidature:
        'LISTER_CANDIDATURES_ELIGIBLES_PREUVE_RECANDIDATURE_QUERY',
    },
  },
  document: {
    query: {
      consulter: 'CONSULTER_DOCUMENT_PROJET',
      générerModèleRéponse: 'GENERER_MODELE_REPONSE_ABANDON_QUERY',
    },
    command: {
      enregister: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
    },
  },
  réseau: {
    gestionnaire: {
      query: {
        consulter: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
        lister: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
      },
      usecase: {
        ajouter: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
        modifier: 'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
      },
      command: {
        ajouter: 'AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND',
        modifier: 'MODIFIER_GESTIONNAIRE_RÉSEAU_COMMAND',
      },
    },
    raccordement: {
      query: {
        consulter: 'CONSULTER_RACCORDEMENT_QUERY',
        consulterDossier: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
        consulterGestionnaireRéseau: 'CONSULTER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_QUERY',
        rechercher: 'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
      },
      usecase: {
        modifierDemandeComplète: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        modifierGestionnaireRéseau: 'MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_USE_CASE',
        modifierPropostionTechniqueEtFinancière:
          'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
        modifierRéférenceDossier: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE',
        transmettreDateMiseEnService: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
        transmettreDemandeComplète: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        transmettrePropositionTechniqueEtFinancière:
          'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
      },
      command: {
        modifierDemandeComplète: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
        modifierGestionnaireRéseau: 'MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_COMMAND',
        modifierPropostionTechniqueEtFinancière:
          'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
        modifierRéférenceDossier: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_COMMAND',
        transmettreDateMiseEnService: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_COMMAND',
        transmettreDemandeComplète: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
        transmettrePropositionTechniqueEtFinancière:
          'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
      },
    },
  },
  utilisateur: {
    query: {
      consulter: 'CONSULTER_UTILISATEUR_QUERY',
    },
  },
  tâche: {
    query: {
      consulterNombre: 'CONSULTER_NOMBRE_TÂCHES_QUERY',
      lister: 'LISTER_TÂCHES_QUERY',
    },
  },
} as const;

const permissionAdmin = [
  référencielPermissions.lauréat.abandon.query.consulter,
  référencielPermissions.lauréat.abandon.query.lister,
  référencielPermissions.lauréat.abandon.query.détecter,
  référencielPermissions.lauréat.abandon.usecase.accorder,
  référencielPermissions.lauréat.abandon.command.accorder,
  référencielPermissions.lauréat.abandon.usecase.annulerRejet,
  référencielPermissions.lauréat.abandon.command.annulerRejet,
  référencielPermissions.lauréat.abandon.usecase.demanderConfirmation,
  référencielPermissions.lauréat.abandon.command.demanderConfirmation,
  référencielPermissions.lauréat.abandon.usecase.rejeter,
  référencielPermissions.lauréat.abandon.command.rejeter,

  référencielPermissions.appelOffre.query.consulter,
  référencielPermissions.appelOffre.query.lister,

  référencielPermissions.candidature.query.consulter,

  référencielPermissions.document.query.consulter,
  référencielPermissions.document.query.générerModèleRéponse,
  référencielPermissions.document.command.enregister,

  référencielPermissions.appelOffre.cahierDesCharges.query.consulter,

  référencielPermissions.réseau.gestionnaire.query.consulter,
  référencielPermissions.réseau.gestionnaire.query.lister,
  référencielPermissions.réseau.gestionnaire.usecase.ajouter,
  référencielPermissions.réseau.gestionnaire.command.ajouter,
  référencielPermissions.réseau.gestionnaire.usecase.modifier,
  référencielPermissions.réseau.gestionnaire.command.modifier,

  référencielPermissions.réseau.raccordement.query.consulter,
  référencielPermissions.réseau.raccordement.query.consulterDossier,
  référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
  référencielPermissions.réseau.raccordement.query.rechercher,
  référencielPermissions.réseau.raccordement.usecase.modifierDemandeComplète,
  référencielPermissions.réseau.raccordement.command.modifierDemandeComplète,
  référencielPermissions.réseau.raccordement.usecase.modifierGestionnaireRéseau,
  référencielPermissions.réseau.raccordement.command.modifierGestionnaireRéseau,
  référencielPermissions.réseau.raccordement.usecase.modifierPropostionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.command.modifierPropostionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.usecase.modifierRéférenceDossier,
  référencielPermissions.réseau.raccordement.command.modifierRéférenceDossier,
  référencielPermissions.réseau.raccordement.usecase.transmettreDateMiseEnService,
  référencielPermissions.réseau.raccordement.command.transmettreDateMiseEnService,
  référencielPermissions.réseau.raccordement.usecase.transmettreDemandeComplète,
  référencielPermissions.réseau.raccordement.command.transmettreDemandeComplète,
  référencielPermissions.réseau.raccordement.usecase.transmettrePropositionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.command.transmettrePropositionTechniqueEtFinancière,

  référencielPermissions.utilisateur.query.consulter,
];

const permissionCRE = [
  référencielPermissions.lauréat.abandon.query.consulter,
  référencielPermissions.lauréat.abandon.query.lister,
  référencielPermissions.lauréat.abandon.query.détecter,

  référencielPermissions.appelOffre.query.lister,

  référencielPermissions.candidature.query.consulter,

  référencielPermissions.document.query.consulter,
];

const permissionDreal = [
  référencielPermissions.lauréat.abandon.query.consulter,
  référencielPermissions.lauréat.abandon.query.lister,
  référencielPermissions.lauréat.abandon.query.détecter,

  référencielPermissions.appelOffre.query.lister,
  référencielPermissions.appelOffre.query.consulter,
  référencielPermissions.appelOffre.cahierDesCharges.query.consulter,

  référencielPermissions.candidature.query.consulter,

  référencielPermissions.document.query.consulter,
  référencielPermissions.document.query.générerModèleRéponse,

  référencielPermissions.utilisateur.query.consulter,
];

const permissionDgecValidateur = [
  référencielPermissions.lauréat.abandon.query.consulter,
  référencielPermissions.lauréat.abandon.query.lister,
  référencielPermissions.lauréat.abandon.query.détecter,
  référencielPermissions.lauréat.abandon.usecase.accorder,
  référencielPermissions.lauréat.abandon.command.accorder,
  référencielPermissions.lauréat.abandon.usecase.annulerRejet,
  référencielPermissions.lauréat.abandon.command.annulerRejet,
  référencielPermissions.lauréat.abandon.usecase.demanderConfirmation,
  référencielPermissions.lauréat.abandon.command.demanderConfirmation,
  référencielPermissions.lauréat.abandon.usecase.rejeter,
  référencielPermissions.lauréat.abandon.command.rejeter,

  référencielPermissions.appelOffre.query.consulter,
  référencielPermissions.appelOffre.query.lister,

  référencielPermissions.candidature.query.consulter,

  référencielPermissions.document.query.consulter,
  référencielPermissions.document.query.générerModèleRéponse,
  référencielPermissions.document.command.enregister,

  référencielPermissions.appelOffre.cahierDesCharges.query.consulter,

  référencielPermissions.réseau.gestionnaire.query.consulter,
  référencielPermissions.réseau.gestionnaire.query.lister,
  référencielPermissions.réseau.gestionnaire.usecase.ajouter,
  référencielPermissions.réseau.gestionnaire.command.ajouter,
  référencielPermissions.réseau.gestionnaire.usecase.modifier,
  référencielPermissions.réseau.gestionnaire.command.modifier,

  référencielPermissions.réseau.raccordement.query.consulter,
  référencielPermissions.réseau.raccordement.query.consulterDossier,
  référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
  référencielPermissions.réseau.raccordement.query.rechercher,
  référencielPermissions.réseau.raccordement.usecase.modifierDemandeComplète,
  référencielPermissions.réseau.raccordement.command.modifierDemandeComplète,
  référencielPermissions.réseau.raccordement.usecase.modifierGestionnaireRéseau,
  référencielPermissions.réseau.raccordement.command.modifierGestionnaireRéseau,
  référencielPermissions.réseau.raccordement.usecase.modifierPropostionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.command.modifierPropostionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.usecase.modifierRéférenceDossier,
  référencielPermissions.réseau.raccordement.command.modifierRéférenceDossier,
  référencielPermissions.réseau.raccordement.usecase.transmettreDateMiseEnService,
  référencielPermissions.réseau.raccordement.command.transmettreDateMiseEnService,
  référencielPermissions.réseau.raccordement.usecase.transmettreDemandeComplète,
  référencielPermissions.réseau.raccordement.command.transmettreDemandeComplète,
  référencielPermissions.réseau.raccordement.usecase.transmettrePropositionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.command.transmettrePropositionTechniqueEtFinancière,

  référencielPermissions.utilisateur.query.consulter,
];

const permissionPorteurProjet = [
  référencielPermissions.lauréat.abandon.query.consulter,
  référencielPermissions.lauréat.abandon.query.lister,
  référencielPermissions.lauréat.abandon.query.détecter,

  référencielPermissions.lauréat.abandon.usecase.annuler,
  référencielPermissions.lauréat.abandon.command.annuler,
  référencielPermissions.lauréat.abandon.usecase.confirmer,
  référencielPermissions.lauréat.abandon.command.confirmer,
  référencielPermissions.lauréat.abandon.usecase.demander,
  référencielPermissions.lauréat.abandon.command.demander,
  référencielPermissions.lauréat.abandon.usecase.transmettrePreuveRecandidature,
  référencielPermissions.lauréat.abandon.command.transmettrePreuveRecandidature,

  référencielPermissions.appelOffre.query.lister,
  référencielPermissions.appelOffre.query.consulter,
  référencielPermissions.appelOffre.cahierDesCharges.query.consulter,

  référencielPermissions.candidature.query.consulter,
  référencielPermissions.candidature.query.listerCandidaturesPreuveRecandidature,

  référencielPermissions.document.query.consulter,

  référencielPermissions.tâche.query.consulterNombre,
  référencielPermissions.tâche.query.lister,

  référencielPermissions.utilisateur.query.consulter,
  référencielPermissions.document.command.enregister,

  référencielPermissions.réseau.gestionnaire.query.consulter,
  référencielPermissions.réseau.gestionnaire.query.lister,

  référencielPermissions.réseau.raccordement.query.consulter,
  référencielPermissions.réseau.raccordement.query.consulterDossier,
  référencielPermissions.réseau.raccordement.query.consulterGestionnaireRéseau,
  référencielPermissions.réseau.raccordement.query.rechercher,

  référencielPermissions.réseau.raccordement.usecase.transmettreDemandeComplète,
  référencielPermissions.réseau.raccordement.command.transmettreDemandeComplète,
  référencielPermissions.réseau.raccordement.usecase.modifierDemandeComplète,
  référencielPermissions.réseau.raccordement.command.modifierDemandeComplète,
  référencielPermissions.réseau.raccordement.usecase.modifierRéférenceDossier,
  référencielPermissions.réseau.raccordement.command.modifierRéférenceDossier,

  référencielPermissions.réseau.raccordement.usecase.transmettrePropositionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.command.transmettrePropositionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.usecase.modifierPropostionTechniqueEtFinancière,
  référencielPermissions.réseau.raccordement.command.modifierPropostionTechniqueEtFinancière,
];

const permissions: Record<RawType, string[]> = {
  admin: permissionAdmin,
  'acheteur-obligé': [],
  ademe: [],
  'caisse-des-dépôts': [],
  cre: permissionCRE,
  dreal: permissionDreal,
  'dgec-validateur': permissionDgecValidateur,
  'porteur-projet': permissionPorteurProjet,
};
