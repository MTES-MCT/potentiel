import { makeHtml } from './index.html';
import {
  AbonnementLettreInformation,
  AdemeStatistiques,
  AdminStatistiques,
  DemanderDelai,
  DrealList,
  Error,
  GarantiesFinancieres,
  Home,
  ModificationRequest,
  ModificationRequestList,
  NewModificationRequest,
  PartnersList,
  ProjectDetails,
  SignalerDemandeAbandon,
  SignalerDemandeDelai,
  SignalerDemandeRecours,
  Signup,
  Statistiques,
  UploadLegacyModificationFiles,
  ChangerProducteur,
  DemanderAbandon,
  DemandeAbandon,
  DemandeAnnulationAbandon,
  DemanderChangementPuissance,
  ChoisirCahierDesCharges,
  ChangerFournisseur,
  AdminNotificationCandidats,
  AdminRegénérerPeriodeAttestations,
  AdminImporterCandidats,
  ListeProjets,
  SuccèsOuErreur,
  FakeLogin,
  InvitationsCandidatsEnAttente,
  EmailsEnErreur,
  ProjetsÀRéclamer,
  LienInvitationPérimé,
  AccèsNonAutorisé,
  DéclarationAccessibilité,
  InviterDgecValidateur,
  AcheteurObligeStatistiques,
  CreStatistiques,
  ListeGestionnairesRéseau,
  ModifierGestionnaireRéseau,
  AjouterGestionnaireRéseau,
  TransmettreDemandeComplèteRaccordement,
  ListeDossiersRaccordement,
  TransmettreDateMiseEnService,
  TransmettrePropositionTechniqueEtFinancière,
  ModifierDemandeComplèteRaccordement,
  ModifierGestionnaireRéseauProjet,
  ModifierPropositionTechniqueEtFinancière,
  AucunDossierALister,
  ImporterDatesMiseEnService,
  EnregistrerGarantiesFinancières,
} from './pages';

export { App } from './App';

export const StatistiquesPage = (props: Parameters<typeof Statistiques>[0]) =>
  makeHtml({
    Component: Statistiques,
    props,
    title: 'Tableau de bord public',
  });

export const AdminStatistiquesPage = (props: Parameters<typeof AdminStatistiques>[0]) =>
  makeHtml({
    Component: AdminStatistiques,
    props,
    title: 'Tableau de bord',
  });

export const AdemeStatistiquesPage = (props: Parameters<typeof AdemeStatistiques>[0]) =>
  makeHtml({
    Component: AdemeStatistiques,
    props,
    title: 'Tableau de bord',
  });

export const AcheteurObligeStatistiquesPage = (
  props: Parameters<typeof AcheteurObligeStatistiques>[0],
) =>
  makeHtml({
    Component: AcheteurObligeStatistiques,
    props,
    title: 'Tableau de bord',
  });

export const CreStatistiquesPage = (props: Parameters<typeof CreStatistiques>[0]) =>
  makeHtml({
    Component: CreStatistiques,
    props,
    title: 'Tableau de bord',
  });

export const ProjectDetailsPage = (props: Parameters<typeof ProjectDetails>[0]) =>
  makeHtml({
    Component: ProjectDetails,
    props,
    title: props.project.nomProjet,
  });

export const ChoisirCahierDesChargesPage = (props: Parameters<typeof ChoisirCahierDesCharges>[0]) =>
  makeHtml({
    Component: ChoisirCahierDesCharges,
    props,
    title: 'Changer de cahier des charges',
  });

export const GarantiesFinancieresPage = (props: Parameters<typeof GarantiesFinancieres>[0]) =>
  makeHtml({
    Component: GarantiesFinancieres,
    props,
    title: 'Garanties financières',
  });

export const NewModificationRequestPage = (props: Parameters<typeof NewModificationRequest>[0]) =>
  makeHtml({
    Component: NewModificationRequest,
    props,
    title: 'Nouvelle demande',
  });

export const ErrorPage = (props: Parameters<typeof Error>[0]) =>
  makeHtml({
    Component: Error,
    props,
    title: 'Erreur',
  });

export const ModificationRequestPage = (props: Parameters<typeof ModificationRequest>[0]) =>
  makeHtml({
    Component: ModificationRequest,
    props,
    title: 'Détails demande',
  });

export const DemanderDelaiPage = (props: Parameters<typeof DemanderDelai>[0]) =>
  makeHtml({
    Component: DemanderDelai,
    props,
    title: 'Demander délai',
  });

export const DemanderAbandonPage = (props: Parameters<typeof DemanderAbandon>[0]) =>
  makeHtml({
    Component: DemanderAbandon,
    props,
    title: 'Demander abandon',
  });

export const DemanderChangementPuissancePage = (
  props: Parameters<typeof DemanderChangementPuissance>[0],
) =>
  makeHtml({
    Component: DemanderChangementPuissance,
    props,
    title: 'Demander changement de puissance',
  });

export const ChangerProducteurPage = (props: Parameters<typeof ChangerProducteur>[0]) =>
  makeHtml({
    Component: ChangerProducteur,
    props,
    title: 'Changer producteur',
  });

export const ChangerFournisseurPage = (props: Parameters<typeof ChangerFournisseur>[0]) =>
  makeHtml({
    Component: ChangerFournisseur,
    props,
    title: 'Changer fournisseur',
  });

export const DemandeAbandonPage = (props: Parameters<typeof DemandeAbandon>[0]) =>
  makeHtml({
    Component: DemandeAbandon,
    props,
    title: 'Demande abandon',
  });

export const DemandeAnnulationAbandonPage = (
  props: Parameters<typeof DemandeAnnulationAbandon>[0],
) =>
  makeHtml({
    Component: DemandeAnnulationAbandon,
    props,
    title: 'Demande annulation abandon',
  });

export const ModificationRequestListPage = (props: Parameters<typeof ModificationRequestList>[0]) =>
  makeHtml({
    Component: ModificationRequestList,
    props,
    title: 'Demandes de modification',
  });

export const HomePage = (props: Parameters<typeof Home>[0]) =>
  makeHtml({
    Component: Home,
    props,
    title: 'Accueil',
  });

export const DéclarationAccessibilitéPage = (props: Parameters<typeof Home>[0]) =>
  makeHtml({
    Component: DéclarationAccessibilité,
    props,
    title: `Déclaration d'accessibilité`,
  });

export const UploadLegacyModificationFilesPage = (
  props: Parameters<typeof UploadLegacyModificationFiles>[0],
) =>
  makeHtml({
    Component: UploadLegacyModificationFiles,
    props,
    title: 'Importer courriers historiques',
  });

export const SignalerDemandeDelaiPage = (props: Parameters<typeof SignalerDemandeDelai>[0]) =>
  makeHtml({
    Component: SignalerDemandeDelai,
    props,
    title: 'Signaler demande de délai',
  });

export const SignalerDemandeAbandonPage = (props: Parameters<typeof SignalerDemandeAbandon>[0]) =>
  makeHtml({
    Component: SignalerDemandeAbandon,
    props,
    title: 'Signaler demande abandon',
  });

export const SignalerDemandeRecoursPage = (props: Parameters<typeof SignalerDemandeRecours>[0]) =>
  makeHtml({
    Component: SignalerDemandeRecours,
    props,
    title: 'Signaler demande recours',
  });

export const SignupPage = (props: Parameters<typeof Signup>[0]) =>
  makeHtml({
    Component: Signup,
    props,
    title: 'Inscription',
  });

export const DrealListPage = (props: Parameters<typeof DrealList>[0]) =>
  makeHtml({
    Component: DrealList,
    props,
    title: 'DREALs',
  });

export const PartnersListPage = (props: Parameters<typeof PartnersList>[0]) =>
  makeHtml({
    Component: PartnersList,
    props,
    title: 'Partenaires',
  });

export const AbonnementLettreInformationPage = (
  props: Parameters<typeof AbonnementLettreInformation>[0],
) =>
  makeHtml({
    Component: AbonnementLettreInformation,
    props,
    title: 'Abdonnement lettre information',
  });

export const AdminNotificationCandidatsPage = (
  props: Parameters<typeof AdminNotificationCandidats>[0],
) =>
  makeHtml({
    Component: AdminNotificationCandidats,
    props,
    title: 'Notifier des candidats',
  });

export const AdminRegénérerPeriodeAttestationsPage = (
  props: Parameters<typeof AdminRegénérerPeriodeAttestations>[0],
) =>
  makeHtml({
    Component: AdminRegénérerPeriodeAttestations,
    props,
    title: 'Regénérer période attestations',
  });

export const AdminImporterCandidatsPage = (props: Parameters<typeof AdminImporterCandidats>[0]) =>
  makeHtml({
    Component: AdminImporterCandidats,
    props,
    title: 'Importer des candidats',
  });

export const ListeProjetsPage = (props: Parameters<typeof ListeProjets>[0]) =>
  makeHtml({
    Component: ListeProjets,
    props,
    title: 'Projets',
  });

export const SuccèsOuErreurPage = (props: Parameters<typeof SuccèsOuErreur>[0]) =>
  makeHtml({
    Component: SuccèsOuErreur,
    props,
  });

export const FakeLoginPage = (props: Parameters<typeof FakeLogin>[0]) =>
  makeHtml({
    Component: FakeLogin,
    props,
  });

export const InvitationsCandidatsEnAttentePage = (
  props: Parameters<typeof InvitationsCandidatsEnAttente>[0],
) =>
  makeHtml({
    Component: InvitationsCandidatsEnAttente,
    props,
    title: 'Invitations en attente',
  });

export const EmailsEnErreurPage = (props: Parameters<typeof EmailsEnErreur>[0]) =>
  makeHtml({
    Component: EmailsEnErreur,
    props,
    title: 'Emails en erreur',
  });

export const ProjetsÀRéclamerPage = (props: Parameters<typeof ProjetsÀRéclamer>[0]) =>
  makeHtml({
    Component: ProjetsÀRéclamer,
    props,
    title: 'Projets à réclamer',
  });

export const LienInvitationPériméPage = (props: Parameters<typeof LienInvitationPérimé>[0]) =>
  makeHtml({
    Component: LienInvitationPérimé,
    props,
    title: 'Lien invitation périmé',
  });

export const AccèsNonAutoriséPage = (props: Parameters<typeof AccèsNonAutorisé>[0]) =>
  makeHtml({
    Component: AccèsNonAutorisé,
    props,
  });

export const InviterDgecValidateurPage = (props: Parameters<typeof InviterDgecValidateur>[0]) =>
  makeHtml({
    Component: InviterDgecValidateur,
    props,
    title: 'Inviter un utilisateur DGEC validateur',
  });

export const ListeGestionnairesRéseauPage = (
  props: Parameters<typeof ListeGestionnairesRéseau>[0],
) =>
  makeHtml({
    Component: ListeGestionnairesRéseau,
    props,
    title: 'Liste des gestionnaires de réseau',
  });

export const ConsulterGestionnairesRéseauPage = (
  props: Parameters<typeof ModifierGestionnaireRéseau>[0],
) =>
  makeHtml({
    Component: ModifierGestionnaireRéseau,
    props,
    title: 'Détail du gestionnaire de réseau',
  });

export const AjouterGestionnaireRéseauPage = (
  props: Parameters<typeof AjouterGestionnaireRéseau>[0],
) =>
  makeHtml({
    Component: AjouterGestionnaireRéseau,
    props,
    title: 'Ajouter un gestionnaire de réseau',
  });

export const TransmettreDemandeComplèteRaccordementPage = (
  props: Parameters<typeof TransmettreDemandeComplèteRaccordement>[0],
) =>
  makeHtml({
    Component: TransmettreDemandeComplèteRaccordement,
    props,
    title: 'Transmettre une demande complète de raccordement',
  });

export const ListeDossiersRaccordementPage = (
  props: Parameters<typeof ListeDossiersRaccordement>[0],
) =>
  makeHtml({
    Component: ListeDossiersRaccordement,
    props,
    title: 'Liste des dossiers de raccordement',
  });

export const TransmettreDateMiseEnServicePage = (
  props: Parameters<typeof TransmettreDateMiseEnService>[0],
) =>
  makeHtml({
    Component: TransmettreDateMiseEnService,
    props,
    title: 'Transmettre une date de mise en service',
  });

export const TransmettrePropositionTechniqueEtFinancièrePage = (
  props: Parameters<typeof TransmettrePropositionTechniqueEtFinancière>[0],
) =>
  makeHtml({
    Component: TransmettrePropositionTechniqueEtFinancière,
    props,
    title: 'Transmettre une proposition technique et financière',
  });

export const ModifierDemandeComplèteRaccordementPage = (
  props: Parameters<typeof ModifierDemandeComplèteRaccordement>[0],
) =>
  makeHtml({
    Component: ModifierDemandeComplèteRaccordement,
    props,
    title: 'Modifier une demande complète de raccordement',
  });

export const ModifierGestionnaireRéseauProjetPage = (
  props: Parameters<typeof ModifierGestionnaireRéseauProjet>[0],
) =>
  makeHtml({
    Component: ModifierGestionnaireRéseauProjet,
    props,
    title: 'Modifier le gestionnaire réseau du projet',
  });

export const ModifierPropositionTechniqueEtFinancièrePage = (
  props: Parameters<typeof ModifierPropositionTechniqueEtFinancière>[0],
) =>
  makeHtml({
    Component: ModifierPropositionTechniqueEtFinancière,
    props,
    title: 'Modifier une proposition technique et financière',
  });

export const AucunDossierAListerPage = (props: Parameters<typeof AucunDossierALister>[0]) =>
  makeHtml({
    Component: AucunDossierALister,
    props,
    title: 'Aucun dossier de raccordement à lister',
  });

export const ImporterDatesMiseEnServicePage = (
  props: Parameters<typeof ImporterDatesMiseEnService>[0],
) =>
  makeHtml({
    Component: ImporterDatesMiseEnService,
    props,
    title: 'Importer des dates de mise en service',
  });

export const EnregistrerGarantiesFinancièresPage = (
  props: Parameters<typeof EnregistrerGarantiesFinancières>[0],
) =>
  makeHtml({
    Component: EnregistrerGarantiesFinancières,
    props,
    title: 'Enregistrer les garanties financières',
  });
