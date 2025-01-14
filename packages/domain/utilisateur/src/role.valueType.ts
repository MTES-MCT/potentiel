import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { AccèsFonctionnalitéRefuséError, RoleRefuséError } from './errors';

export type RawType =
  | 'admin'
  | 'porteur-projet'
  | 'dreal'
  | 'acheteur-obligé'
  | 'ademe'
  | 'dgec-validateur'
  | 'caisse-des-dépôts'
  | 'cre'
  | 'grd';

export const roles: Array<RawType> = [
  'admin',
  'porteur-projet',
  'dreal',
  'acheteur-obligé',
  'ademe',
  'dgec-validateur',
  'caisse-des-dépôts',
  'cre',
  'grd',
];

export type ValueType = ReadonlyValueType<{
  nom: RawType;
  libellé(): string;
  peutExécuterMessage(typeMessage: string): void;
  aLaPermission(value: Policy): boolean;
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
  };
};

export const bind = ({ nom }: PlainType<ValueType>) => {
  return convertirEnValueType(nom);
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
export const ademe = convertirEnValueType('ademe');
export const dgecValidateur = convertirEnValueType('dgec-validateur');
export const dreal = convertirEnValueType('dreal');
export const cre = convertirEnValueType('cre');
export const acheteurObligé = convertirEnValueType('acheteur-obligé');
export const caisseDesDépôts = convertirEnValueType('caisse-des-dépôts');
export const grd = convertirEnValueType('grd');

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
    représentantLégal: {
      query: {
        consulter: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        consulterChangement: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        listerChangement: 'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
      },
      usecase: {
        modifier: 'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
        demanderChangement: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
        accorderChangement: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
        rejeterChangement: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
      },
      command: {
        modifier: 'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
        demanderChangement: 'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
        accorderChangement: 'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
        rejeterChangement: 'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
      },
    },
    actionnaire: {
      query: {
        consulter: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        consulterChangement: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
        listerChangement: 'Lauréat.Actionnaire.Query.ListerChangementActionnaire',
      },
      usecase: {
        modifier: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
        demanderChangement: 'Lauréat.Actionnaire.UseCase.DemanderChangement',
        accorderChangement: 'Lauréat.Actionnaire.UseCase.AccorderChangement',
        rejeterChangement: 'Lauréat.Actionnaire.UseCase.RejeterDemandeChangement',
        annulerChangement: 'Lauréat.Actionnaire.UseCase.AnnulerDemandeChangement',
      },
      command: {
        modifier: 'Lauréat.Actionnaire.Command.ModifierActionnaire',
        demanderChangement: 'Lauréat.Actionnaire.Command.DemanderChangement',
        accorderChangement: 'Lauréat.Actionnaire.Command.AccorderChangement',
        rejeterChangement: 'Lauréat.Actionnaire.Command.RejeterDemandeChangement',
        annulerChangement: 'Lauréat.Actionnaire.Command.AnnulerDemandeChangement',
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
      consulterRésuméCandidature: 'Candidature.Query.ConsulterRésuméCandidature',
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
  historique: {
    query: {
      lister: 'Historique.Query.ListerHistoriqueProjet',
    },
  },
} as const;

/**
 * Liste des droits fonctionnels, par domaine
 */
const policies = {
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
    consulterRésumé: [référencielPermissions.candidature.query.consulterRésuméCandidature],
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
    demanderChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.demanderChangement,
      référencielPermissions.lauréat.représentantLégal.command.demanderChangement,
    ],
    accorderChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.accorderChangement,
      référencielPermissions.lauréat.représentantLégal.command.accorderChangement,
    ],
    rejeterChangement: [
      référencielPermissions.lauréat.représentantLégal.usecase.rejeterChangement,
      référencielPermissions.lauréat.représentantLégal.command.rejeterChangement,
    ],
    consulterChangement: [
      référencielPermissions.lauréat.représentantLégal.query.consulterChangement,
    ],
    listerChangement: [référencielPermissions.lauréat.représentantLégal.query.listerChangement],
  },
  historique: {
    lister: [référencielPermissions.historique.query.lister],
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
    consulterChangement: [référencielPermissions.lauréat.actionnaire.query.consulterChangement],
    demanderChangement: [
      référencielPermissions.lauréat.actionnaire.usecase.demanderChangement,
      référencielPermissions.lauréat.actionnaire.command.demanderChangement,
    ],
    accorderChangement: [
      référencielPermissions.appelOffre.cahierDesCharges.query.consulter,
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
    listerChangement: [référencielPermissions.lauréat.actionnaire.query.listerChangement],
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

type Policy = Leaves<typeof policies>;

const commonPolicies: ReadonlyArray<Policy> = ['candidature.consulterRésumé', 'historique.lister'];

// En attendant d'avoir des gateways qui groupent les query
const pageProjetPolicies: Policy[] = [
  ...commonPolicies,
  // Abandon
  'abandon.consulter.détail',
  // Recours
  'recours.consulter.détail',

  // Achèvement
  'achèvement.consulter',

  // Candidature
  'candidature.attestation.télécharger',

  // Représentant légal
  'représentantLégal.consulter',

  // Actionnaire
  'actionnaire.consulter',
];

const adminPolicies: ReadonlyArray<Policy> = [
  ...pageProjetPolicies,

  // Abandon
  'abandon.consulter.liste',
  'abandon.accorder',
  'abandon.rejeter',
  'abandon.demander-confirmation',
  'abandon.annuler-rejet',

  // Recours
  'recours.consulter.liste',
  'recours.accorder',
  'recours.rejeter',

  // Gestionnaire réseau
  'réseau.gestionnaire.lister',
  'réseau.gestionnaire.ajouter',
  'réseau.gestionnaire.modifier',

  // Raccordement
  'réseau.raccordement.consulter',
  'réseau.raccordement.gestionnaire.modifier',
  'réseau.raccordement.demande-complète-raccordement.transmettre',
  'réseau.raccordement.demande-complète-raccordement.modifier',
  'réseau.raccordement.proposition-technique-et-financière.transmettre',
  'réseau.raccordement.proposition-technique-et-financière.modifier',
  'réseau.raccordement.date-mise-en-service.transmettre',
  'réseau.raccordement.date-mise-en-service.modifier',
  'réseau.raccordement.date-mise-en-service.importer',
  'réseau.raccordement.référence-dossier.modifier',
  'réseau.raccordement.dossier.supprimer',
  'réseau.raccordement.listerDossierRaccordement',

  // Garanties financières
  'garantiesFinancières.archives.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.dépôt.demander',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.importer',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.effacerHistorique',
  'garantiesFinancières.enAttente.consulter',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.générerModèleMiseEnDemeure',
  'garantiesFinancières.mainlevée.lister',

  // Achèvement
  'achèvement.transmettre',
  'achèvement.modifier',

  // Candidature
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
];

const dgecValidateurPolicies: ReadonlyArray<Policy> = [
  ...adminPolicies,

  // Abandon
  'abandon.preuve-recandidature.accorder',

  // Période
  'période.notifier',
];

const crePolicies: ReadonlyArray<Policy> = [
  ...pageProjetPolicies,

  // Abandon
  'abandon.consulter.liste',

  // Recours
  'recours.consulter.liste',

  // Gestionnaire réseau
  'réseau.gestionnaire.lister',

  // Raccordement
  'réseau.raccordement.consulter',
  'réseau.raccordement.listerDossierRaccordement',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.enAttente.consulter',
];

const drealPolicies: ReadonlyArray<Policy> = [
  ...pageProjetPolicies,
  // Abandon
  'abandon.consulter.liste',

  // Recours
  'recours.consulter.liste',

  // Raccordement
  'réseau.raccordement.consulter',
  'réseau.raccordement.listerDossierRaccordement',
  'réseau.raccordement.demande-complète-raccordement.transmettre',
  'réseau.raccordement.demande-complète-raccordement.modifier',
  'réseau.raccordement.proposition-technique-et-financière.transmettre',
  'réseau.raccordement.proposition-technique-et-financière.modifier',
  'réseau.raccordement.gestionnaire.modifier',

  // Garanties financières
  'garantiesFinancières.archives.consulter',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.dépôt.demander',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.effacerHistorique',
  'garantiesFinancières.enAttente.consulter',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.générerModèleMiseEnDemeure',
  'garantiesFinancières.mainlevée.démarrerInstruction',
  'garantiesFinancières.mainlevée.accorder',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.rejeter',

  // Achèvement
  'achèvement.consulter',
  'achèvement.transmettre',
  'achèvement.modifier',

  // Candidature
  'candidature.attestation.télécharger',

  // Représentant légal
  'représentantLégal.modifier',
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',
  'représentantLégal.accorderChangement',
  'représentantLégal.rejeterChangement',

  // Actionnaire
  'actionnaire.consulter',
  'actionnaire.modifier',
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',
  'actionnaire.accorderChangement',
  'actionnaire.rejeterChangement',
];

const porteurProjetPolicies: ReadonlyArray<Policy> = [
  ...pageProjetPolicies,
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
  'réseau.raccordement.consulter',
  'réseau.raccordement.gestionnaire.modifier',
  'réseau.raccordement.demande-complète-raccordement.transmettre',
  'réseau.raccordement.demande-complète-raccordement.modifier',
  'réseau.raccordement.proposition-technique-et-financière.transmettre',
  'réseau.raccordement.proposition-technique-et-financière.modifier',
  'réseau.raccordement.référence-dossier.modifier',
  'réseau.raccordement.dossier.supprimer',

  // Tâche
  'tâche.consulter',

  // Garanties financières
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.demander',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.soumettre',
  'garantiesFinancières.dépôt.supprimer',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.effacerHistorique',
  'garantiesFinancières.mainlevée.demander',
  'garantiesFinancières.mainlevée.annuler',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.consulter',

  // Achèvement
  'achèvement.consulter',
  'achèvement.transmettre',

  // Candidature
  'candidature.attestation.télécharger',

  // Représentant légal
  'représentantLégal.demanderChangement',
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',
  'représentantLégal.consulter',

  // Actionnaire
  'actionnaire.modifier',
  'actionnaire.consulter',
  'actionnaire.consulterChangement',
  'actionnaire.demanderChangement',
  'actionnaire.annulerChangement',
  'actionnaire.listerChangement',
];

const acheteurObligéPolicies: ReadonlyArray<Policy> = [
  ...pageProjetPolicies,
  'réseau.raccordement.consulter',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.enAttente.consulter',

  // Achèvement
  // 'achèvement.transmettre',
];

const caisseDesDépôtsPolicies: ReadonlyArray<Policy> = [
  ...pageProjetPolicies,
  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.enAttente.consulter',
];

const grdPolicies: ReadonlyArray<Policy> = [
  ...commonPolicies,

  // Gestionnaire réseau
  'réseau.gestionnaire.consulter',

  // Raccordement
  'réseau.raccordement.consulter',
  'réseau.raccordement.listerDossierRaccordement',
  'réseau.raccordement.date-mise-en-service.transmettre',
  'réseau.raccordement.date-mise-en-service.modifier',
  'réseau.raccordement.référence-dossier.modifier',
];

const ademePolicies: ReadonlyArray<Policy> = [...pageProjetPolicies];

const policiesParRole: Record<RawType, ReadonlyArray<Policy>> = {
  admin: adminPolicies,
  'acheteur-obligé': acheteurObligéPolicies,
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
