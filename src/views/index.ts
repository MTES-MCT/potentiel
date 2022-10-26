import { makeHtml } from './index.html'
import {
  AbonnementLettreInformation,
  AdemeStatistiques,
  AdminStatistiques,
  DemanderDelai,
  DrealList,
  Error,
  GarantiesFinancieres,
  Home,
  ImporterListingEDF,
  ImporterListingEnedis,
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
  ChoisirCahierDesCharges,
  ChangerFournisseur,
  ImportGestionnaireReseau,
  AdminAppelsOffres,
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
} from './pages'

export const StatistiquesPage = (props: Parameters<typeof Statistiques>[0]) =>
  makeHtml({
    Component: Statistiques,
    props,
    pageName: 'statistiques',
    title: 'Tableau de bord public',
  })

export const AdminStatistiquesPage = (props: Parameters<typeof AdminStatistiques>[0]) =>
  makeHtml({
    Component: AdminStatistiques,
    props,
    pageName: 'adminStatistiques',
    title: 'Tableau de bord',
  })

export const AdemeStatistiquesPage = (props: Parameters<typeof AdemeStatistiques>[0]) =>
  makeHtml({
    Component: AdemeStatistiques,
    props,
    pageName: 'ademeStatistiques',
    title: 'Tableau de bord',
  })

export const ProjectDetailsPage = (props: Parameters<typeof ProjectDetails>[0]) =>
  makeHtml({
    Component: ProjectDetails,
    props,
    pageName: 'projectDetails', // This must match the Component name
    title: props.project.nomProjet,
  })

export const ChoisirCahierDesChargesPage = (props: Parameters<typeof ChoisirCahierDesCharges>[0]) =>
  makeHtml({
    Component: ChoisirCahierDesCharges,
    props,
    pageName: 'choisirCahierDesCharges', // This must match the Component name
    title: 'Changer de cahier des charges',
  })

export const GarantiesFinancieresPage = (props: Parameters<typeof GarantiesFinancieres>[0]) =>
  makeHtml({
    Component: GarantiesFinancieres,
    props,
    pageName: 'garantiesFinancieres', // This must match the Component name
    title: 'Garanties financières',
  })

export const NewModificationRequestPage = (props: Parameters<typeof NewModificationRequest>[0]) =>
  makeHtml({
    Component: NewModificationRequest,
    props,
    pageName: 'newModificationRequest', // This must match the Component name
    title: 'Nouvelle demande',
  })

export const ErrorPage = (props: Parameters<typeof Error>[0]) =>
  makeHtml({
    Component: Error,
    props,
    pageName: 'error',
    title: 'Erreur',
  })

export const ModificationRequestPage = (props: Parameters<typeof ModificationRequest>[0]) =>
  makeHtml({
    Component: ModificationRequest,
    props,
    pageName: 'modificationRequest', // This must match the Component name
    title: 'Détails demande',
  })

export const DemanderDelaiPage = (props: Parameters<typeof DemanderDelai>[0]) =>
  makeHtml({
    Component: DemanderDelai,
    props,
    pageName: 'demanderDelai',
    title: 'Demander délai',
  })

export const DemanderAbandonPage = (props: Parameters<typeof DemanderAbandon>[0]) =>
  makeHtml({
    Component: DemanderAbandon,
    props,
    pageName: 'demanderAbandon',
    title: 'Demander abandon',
  })

export const ChangerProducteurPage = (props: Parameters<typeof ChangerProducteur>[0]) =>
  makeHtml({
    Component: ChangerProducteur,
    props,
    pageName: 'changerProducteur',
    title: 'Changer producteur',
  })

export const ChangerFournisseurPage = (props: Parameters<typeof ChangerFournisseur>[0]) =>
  makeHtml({
    Component: ChangerFournisseur,
    props,
    pageName: 'changerFournisseur',
    title: 'Changer fournisseur',
  })

export const DemandeAbandonPage = (props: Parameters<typeof DemandeAbandon>[0]) =>
  makeHtml({
    Component: DemandeAbandon,
    props,
    pageName: 'demandeAbandon', // This must match the Component name
    title: 'Demande abandon',
  })

export const ModificationRequestListPage = (props: Parameters<typeof ModificationRequestList>[0]) =>
  makeHtml({
    Component: ModificationRequestList,
    props,
    pageName: 'modificationRequestList', // This must match the Component name
    title: 'Demandes de modification',
  })

export const HomePage = (props: Parameters<typeof Home>[0]) =>
  makeHtml({
    Component: Home,
    props,
    pageName: 'home', // This must match the Component name
    title: 'Accueil',
  })

export const UploadLegacyModificationFilesPage = (
  props: Parameters<typeof UploadLegacyModificationFiles>[0]
) =>
  makeHtml({
    Component: UploadLegacyModificationFiles,
    props,
    pageName: 'uploadLegacyModificationFiles',
    title: 'Importer courriers historiques',
  })

export const SignalerDemandeDelaiPage = (props: Parameters<typeof SignalerDemandeDelai>[0]) =>
  makeHtml({
    Component: SignalerDemandeDelai,
    props,
    pageName: 'signalerDemandeDelai', // This must match the Component name
    title: 'Signaler demande de délai',
  })

export const SignalerDemandeAbandonPage = (props: Parameters<typeof SignalerDemandeAbandon>[0]) =>
  makeHtml({
    Component: SignalerDemandeAbandon,
    props,
    pageName: 'signalerDemandeAbandon', // This must match the Component name
    title: 'Signaler demande abandon',
  })

export const SignalerDemandeRecoursPage = (props: Parameters<typeof SignalerDemandeRecours>[0]) =>
  makeHtml({
    Component: SignalerDemandeRecours,
    props,
    pageName: 'signalerDemandeRecours', // This must match the Component name
    title: 'Signaler demande recours',
  })

export const SignupPage = (props: Parameters<typeof Signup>[0]) =>
  makeHtml({
    Component: Signup,
    props,
    pageName: 'signup',
    title: 'Inscription',
  })

export const DrealListPage = (props: Parameters<typeof DrealList>[0]) =>
  makeHtml({
    Component: DrealList,
    props,
    pageName: 'drealList', // This must match the Component name
    title: 'DREALs',
  })

export const PartnersListPage = (props: Parameters<typeof PartnersList>[0]) =>
  makeHtml({
    Component: PartnersList,
    props,
    pageName: 'partnersList', // This must match the Component name
    title: 'Partenaires',
  })

export const ImporterListingEDFPage = (props: Parameters<typeof ImporterListingEDF>[0]) =>
  makeHtml({
    Component: ImporterListingEDF,
    props,
    pageName: 'importerListingEDF',
    title: 'Importer listing EDF',
  })

export const ImporterListingEnedisPage = (props: Parameters<typeof ImporterListingEnedis>[0]) =>
  makeHtml({
    Component: ImporterListingEnedis,
    props,
    pageName: 'importerListingEnedis',
    title: 'Importer listing Enedis',
  })

export const AbonnementLettreInformationPage = (
  props: Parameters<typeof AbonnementLettreInformation>[0]
) =>
  makeHtml({
    Component: AbonnementLettreInformation,
    props,
    pageName: 'abonnementLettreInformation',
    title: 'Abdonnement lettre information',
  })

export const ImportGestionnaireReseauPage = (
  props: Parameters<typeof ImportGestionnaireReseau>[0]
) =>
  makeHtml({
    Component: ImportGestionnaireReseau,
    props,
    pageName: 'importGestionnaireReseau',
    title: 'Importer fichier gestionnaire réseau',
  })

export const AdminAppelsOffresPage = (props: Parameters<typeof AdminAppelsOffres>[0]) =>
  makeHtml({
    Component: AdminAppelsOffres,
    props,
    pageName: 'adminAppelsOffres',
    title: 'Appels offres',
  })

export const AdminNotificationCandidatsPage = (
  props: Parameters<typeof AdminNotificationCandidats>[0]
) =>
  makeHtml({
    Component: AdminNotificationCandidats,
    props,
    pageName: 'adminNotificationCandidats',
    title: 'Notifier des candidats',
  })

export const AdminRegénérerPeriodeAttestationsPage = (
  props: Parameters<typeof AdminRegénérerPeriodeAttestations>[0]
) =>
  makeHtml({
    Component: AdminRegénérerPeriodeAttestations,
    props,
    pageName: 'adminRegénérerPeriodeAttestations',
    title: 'Regénérer période attestations',
  })

export const AdminImporterCandidatsPage = (props: Parameters<typeof AdminImporterCandidats>[0]) =>
  makeHtml({
    Component: AdminImporterCandidats,
    props,
    pageName: 'adminImporterCandidats',
    title: 'Importer des candidats',
  })

export const ListeProjetsPage = (props: Parameters<typeof ListeProjets>[0]) =>
  makeHtml({
    Component: ListeProjets,
    props,
    pageName: 'listeProjets',
    title: 'Projets',
  })

export const SuccèsOuErreurPage = (props: Parameters<typeof SuccèsOuErreur>[0]) =>
  makeHtml({
    Component: SuccèsOuErreur,
    props,
    pageName: 'succèsOuErreur',
  })

export const FakeLoginPage = (props: Parameters<typeof FakeLogin>[0]) =>
  makeHtml({
    Component: FakeLogin,
    props,
    pageName: 'fakeLogin',
  })

export const InvitationsCandidatsEnAttentePage = (
  props: Parameters<typeof InvitationsCandidatsEnAttente>[0]
) =>
  makeHtml({
    Component: InvitationsCandidatsEnAttente,
    props,
    pageName: 'invitationsCandidatsEnAttente',
    title: 'Invitations en attente',
  })

export const EmailsEnErreurPage = (props: Parameters<typeof EmailsEnErreur>[0]) =>
  makeHtml({
    Component: EmailsEnErreur,
    props,
    pageName: 'emailsEnErreur',
    title: 'Emails en erreur',
  })

export const ProjetsÀRéclamerPage = (props: Parameters<typeof ProjetsÀRéclamer>[0]) =>
  makeHtml({
    Component: ProjetsÀRéclamer,
    props,
    pageName: 'projetsÀRéclamer',
    title: 'Projets à réclamer',
  })

export const LienInvitationPériméPage = (props: Parameters<typeof LienInvitationPérimé>[0]) =>
  makeHtml({
    Component: LienInvitationPérimé,
    props,
    pageName: 'lienInvitationPérimé',
    title: 'Lien invitation périmé',
  })
