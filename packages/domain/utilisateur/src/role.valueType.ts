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
      const àLaPermission = permissions[this.nom].includes(permission);

      if (!àLaPermission) {
        throw new AccésFonctionnalitéRefuséError(permission, this.nom);
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

class RoleRefuséError extends OperationRejectedError {
  constructor(value: string) {
    super(`Le role ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class AccésFonctionnalitéRefuséError extends OperationRejectedError {
  constructor(fonctionnalité: string, role: string) {
    super(`Accés à la fonctionnalité refusé`, {
      fonctionnalité,
      role,
    });
  }
}

// MATRICE en mémoire en attendant de pouvoir gérer les permissions depuis une interface d'administration
const permissions: Record<RawType, string[]> = {
  admin: [
    //QUERY
    'CONSULTER_ABANDON_QUERY',
    'LISTER_ABANDONS_QUERY',
    'CONSULTER_APPEL_OFFRE_QUERY',
    'LISTER_APPEL_OFFRE_QUERY',
    'CONSULTER_CANDIDATURE_QUERY',
    'CONSULTER_DOCUMENT_PROJET',
    'GENERER_MODELE_REPONSE_ABANDON_QUERY',
    'CONSULTER_CAHIER_DES_CHARGES_QUERY',
    'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
    'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
    'CONSULTER_UTILISATEUR_QUERY',
    'DÉTECTER_ABANDON_QUERY',
    //USECASE
    'ACCORDER_ABANDON_USECASE',
    'ACCORDER_ABANDON_COMMAND',
    'ANNULER_REJET_ABANDON_USECASE',
    'ANNULER_REJET_ABANDON_COMMAND',
    'DEMANDER_CONFIRMATION_ABANDON_USECASE',
    'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
    'REJETER_ABANDON_USECASE',
    'REJETER_ABANDON_COMMAND',
    'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
    'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
    'AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND',
    'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
    'MODIFIER_GESTIONNAIRE_RÉSEAU_COMMAND',
  ],
  'acheteur-obligé': [],
  ademe: [],
  'caisse-des-dépôts': [],
  cre: [],
  dreal: [
    //QUERY
    'CONSULTER_ABANDON_QUERY',
    'LISTER_ABANDONS_QUERY',
    'CONSULTER_APPEL_OFFRE_QUERY',
    'LISTER_APPEL_OFFRE_QUERY',
    'CONSULTER_CANDIDATURE_QUERY',
    'CONSULTER_DOCUMENT_PROJET',
    'GENERER_MODELE_REPONSE_ABANDON_QUERY',
    'CONSULTER_CAHIER_DES_CHARGES_QUERY',
    'CONSULTER_UTILISATEUR_QUERY',
    'DÉTECTER_ABANDON_QUERY',
  ],
  'dgec-validateur': [
    //QUERY
    'CONSULTER_ABANDON_QUERY',
    'LISTER_ABANDONS_QUERY',
    'CONSULTER_APPEL_OFFRE_QUERY',
    'LISTER_APPEL_OFFRE_QUERY',
    'CONSULTER_CANDIDATURE_QUERY',
    'CONSULTER_DOCUMENT_PROJET',
    'GENERER_MODELE_REPONSE_ABANDON_QUERY',
    'CONSULTER_CAHIER_DES_CHARGES_QUERY',
    'CONSULTER_UTILISATEUR_QUERY',
    'DÉTECTER_ABANDON_QUERY',
    //USECASE
    'ACCORDER_ABANDON_USECASE',
    'ACCORDER_ABANDON_COMMAND',
    'ANNULER_REJET_ABANDON_USECASE',
    'ANNULER_REJET_ABANDON_COMMAND',
    'DEMANDER_CONFIRMATION_ABANDON_USECASE',
    'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
    'REJETER_ABANDON_USECASE',
    'REJETER_ABANDON_COMMAND',
    'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
  ],
  'porteur-projet': [
    //QUERY
    'CONSULTER_ABANDON_QUERY',
    'LISTER_ABANDONS_QUERY',
    'CONSULTER_APPEL_OFFRE_QUERY',
    'LISTER_APPEL_OFFRE_QUERY',
    'CONSULTER_CANDIDATURE_QUERY',
    'CONSULTER_DOCUMENT_PROJET',
    'CONSULTER_CAHIER_DES_CHARGES_QUERY',
    'CONSULTER_NOMBRE_TÂCHES_QUERY',
    'LISTER_TÂCHES_QUERY',
    'CONSULTER_UTILISATEUR_QUERY',
    'LISTER_CANDIDATURES_ELIGIBLES_PREUVE_RECANDIDATURE_QUERY',
    'DÉTECTER_ABANDON_QUERY',
    //USECASE
    'ANNULER_ABANDON_USECASE',
    'ANNULER_ABANDON_COMMAND',
    'CONFIRMER_ABANDON_USECASE',
    'CONFIRMER_ABANDON_COMMAND',
    'DEMANDER_ABANDON_USECASE',
    'DEMANDER_ABANDON_COMMAND',
    'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
    'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
    'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_COMMAND',
  ],
};
