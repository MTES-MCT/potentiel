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
    hydrate: true,
    pageName: 'statistiques',
    title: 'Tableau de bord public',
  })

export const AdminStatistiquesPage = (props: Parameters<typeof AdminStatistiques>[0]) =>
  makeHtml({
    Component: AdminStatistiques,
    props,
    hydrate: true,
    pageName: 'adminStatistiques',
    title: 'Tableau de bord',
  })

export const AdemeStatistiquesPage = (props: Parameters<typeof AdemeStatistiques>[0]) =>
  makeHtml({
    Component: AdemeStatistiques,
    props,
    hydrate: true,
    pageName: 'ademeStatistiques',
    title: 'Tableau de bord',
  })

export const ProjectDetailsPage = (props: Parameters<typeof ProjectDetails>[0]) =>
  makeHtml({
    Component: ProjectDetails,
    props,
    hydrate: true,
    pageName: 'projectDetails', // This must match the Component name
    title: props.project.nomProjet,
  })

export const ChoisirCahierDesChargesPage = (props: Parameters<typeof ChoisirCahierDesCharges>[0]) =>
  makeHtml({
    Component: ChoisirCahierDesCharges,
    props,
    hydrate: true,
    pageName: 'choisirCahierDesCharges', // This must match the Component name
    title: 'Changer de cahier des charges',
  })

export const GarantiesFinancieresPage = (props: Parameters<typeof GarantiesFinancieres>[0]) =>
  makeHtml({
    Component: GarantiesFinancieres,
    props,
    hydrate: true,
    pageName: 'garantiesFinancieres', // This must match the Component name
    title: 'Garanties financières',
  })

export const NewModificationRequestPage = (props: Parameters<typeof NewModificationRequest>[0]) =>
  makeHtml({
    Component: NewModificationRequest,
    props,
    hydrate: true,
    pageName: 'newModificationRequest', // This must match the Component name
    title: 'Nouvelle demande',
  })

export const ErrorPage = (props: Parameters<typeof Error>[0]) =>
  makeHtml({
    Component: Error,
    props,
    hydrate: true,
    pageName: 'error',
    title: 'Erreur',
  })

export const ModificationRequestPage = (props: Parameters<typeof ModificationRequest>[0]) =>
  makeHtml({
    Component: ModificationRequest,
    props,
    hydrate: true,
    pageName: 'modificationRequest', // This must match the Component name
    title: 'Détails demande',
  })

export const DemanderDelaiPage = (props: Parameters<typeof DemanderDelai>[0]) =>
  makeHtml({
    Component: DemanderDelai,
    props,
    hydrate: true,
    pageName: 'demanderDelai',
    title: 'Demander délai',
  })

export const DemanderAbandonPage = (props: Parameters<typeof DemanderAbandon>[0]) =>
  makeHtml({
    Component: DemanderAbandon,
    props,
    hydrate: true,
    pageName: 'demanderAbandon',
    title: 'Demander abandon',
  })

export const ChangerProducteurPage = (props: Parameters<typeof ChangerProducteur>[0]) =>
  makeHtml({
    Component: ChangerProducteur,
    props,
    hydrate: true,
    pageName: 'changerProducteur',
    title: 'Changer producteur',
  })

export const ChangerFournisseurPage = (props: Parameters<typeof ChangerFournisseur>[0]) =>
  makeHtml({
    Component: ChangerFournisseur,
    props,
    hydrate: true,
    pageName: 'changerFournisseur',
    title: 'Changer fournisseur',
  })

export const DemandeAbandonPage = (props: Parameters<typeof DemandeAbandon>[0]) =>
  makeHtml({
    Component: DemandeAbandon,
    props,
    hydrate: true,
    pageName: 'demandeAbandon', // This must match the Component name
    title: 'Demande abandon',
  })

export const ModificationRequestListPage = (props: Parameters<typeof ModificationRequestList>[0]) =>
  makeHtml({
    Component: ModificationRequestList,
    props,
    hydrate: true,
    pageName: 'modificationRequestList', // This must match the Component name
    title: 'Demandes de modification',
  })

export const HomePage = (props: Parameters<typeof Home>[0]) =>
  makeHtml({
    Component: Home,
    props,
    hydrate: true,
    pageName: 'home', // This must match the Component name
    title: 'Accueil',
  })

export const UploadLegacyModificationFilesPage = (
  props: Parameters<typeof UploadLegacyModificationFiles>[0]
) =>
  makeHtml({
    Component: UploadLegacyModificationFiles,
    props,
    hydrate: true,
    pageName: 'uploadLegacyModificationFiles',
    title: 'Importer courriers historiques',
  })

export const SignalerDemandeDelaiPage = (props: Parameters<typeof SignalerDemandeDelai>[0]) =>
  makeHtml({
    Component: SignalerDemandeDelai,
    props,
    hydrate: true,
    pageName: 'signalerDemandeDelai', // This must match the Component name
    title: 'Signaler demande de délai',
  })

export const SignalerDemandeAbandonPage = (props: Parameters<typeof SignalerDemandeAbandon>[0]) =>
  makeHtml({
    Component: SignalerDemandeAbandon,
    props,
    hydrate: true,
    pageName: 'signalerDemandeAbandon', // This must match the Component name
    title: 'Signaler demande abandon',
  })

export const SignalerDemandeRecoursPage = (props: Parameters<typeof SignalerDemandeRecours>[0]) =>
  makeHtml({
    Component: SignalerDemandeRecours,
    props,
    hydrate: true,
    pageName: 'signalerDemandeRecours', // This must match the Component name
    title: 'Signaler demande recours',
  })

export const SignupPage = (props: Parameters<typeof Signup>[0]) =>
  makeHtml({
    Component: Signup,
    props,
    hydrate: true,
    pageName: 'signup',
    title: 'Inscription',
  })

export const DrealListPage = (props: Parameters<typeof DrealList>[0]) =>
  makeHtml({
    Component: DrealList,
    props,
    hydrate: true,
    pageName: 'drealList', // This must match the Component name
    title: 'DREALs',
  })

export const PartnersListPage = (props: Parameters<typeof PartnersList>[0]) =>
  makeHtml({
    Component: PartnersList,
    props,
    hydrate: true,
    pageName: 'partnersList', // This must match the Component name
    title: 'Partenaires',
  })

export const ImporterListingEDFPage = (props: Parameters<typeof ImporterListingEDF>[0]) =>
  makeHtml({
    Component: ImporterListingEDF,
    props,
    hydrate: true,
    pageName: 'importerListingEDF',
    title: 'Importer listing EDF',
  })

export const ImporterListingEnedisPage = (props: Parameters<typeof ImporterListingEnedis>[0]) =>
  makeHtml({
    Component: ImporterListingEnedis,
    props,
    hydrate: true,
    pageName: 'importerListingEnedis',
    title: 'Importer listing Enedis',
  })

export const AbonnementLettreInformationPage = (
  props: Parameters<typeof AbonnementLettreInformation>[0]
) =>
  makeHtml({
    Component: AbonnementLettreInformation,
    props,
    hydrate: true,
    pageName: 'abonnementLettreInformation',
    title: 'Abdonnement lettre information',
  })

export const ImportGestionnaireReseauPage = (
  props: Parameters<typeof ImportGestionnaireReseau>[0]
) =>
  makeHtml({
    Component: ImportGestionnaireReseau,
    props,
    hydrate: true,
    pageName: 'importGestionnaireReseau',
    title: 'Importer fichier gestionnaire réseau',
  })

export const AdminAppelsOffresPage = (props: Parameters<typeof AdminAppelsOffres>[0]) =>
  makeHtml({
    Component: AdminAppelsOffres,
    props,
    hydrate: true,
    pageName: 'adminAppelsOffres',
    title: 'Appels offres',
  })

export const AdminNotificationCandidatsPage = (
  props: Parameters<typeof AdminNotificationCandidats>[0]
) =>
  makeHtml({
    Component: AdminNotificationCandidats,
    props,
    hydrate: true,
    pageName: 'adminNotificationCandidats',
    title: 'Notifier des candidats',
  })

export const AdminRegénérerPeriodeAttestationsPage = (
  props: Parameters<typeof AdminRegénérerPeriodeAttestations>[0]
) =>
  makeHtml({
    Component: AdminRegénérerPeriodeAttestations,
    props,
    hydrate: true,
    pageName: 'adminRegénérerPeriodeAttestations',
    title: 'Regénérer période attestations',
  })

export const AdminImporterCandidatsPage = (props: Parameters<typeof AdminImporterCandidats>[0]) =>
  makeHtml({
    Component: AdminImporterCandidats,
    props,
    hydrate: true,
    pageName: 'adminImporterCandidats',
    title: 'Importer des candidats',
  })

export const ListeProjetsPage = (props: Parameters<typeof ListeProjets>[0]) =>
  makeHtml({
    Component: ListeProjets,
    props,
    hydrate: true,
    pageName: 'listeProjets',
    title: 'Projets',
  })

export const SuccèsOuErreurPage = (props: Parameters<typeof SuccèsOuErreur>[0]) =>
  makeHtml({
    Component: SuccèsOuErreur,
    props,
    pageName: 'succèsOuErreur',
    hydrate: true,
  })

export const FakeLoginPage = (props: Parameters<typeof FakeLogin>[0]) =>
  makeHtml({
    Component: FakeLogin,
    props,
    pageName: 'fakeLogin',
    hydrate: true,
  })

export const InvitationsCandidatsEnAttentePage = (
  props: Parameters<typeof InvitationsCandidatsEnAttente>[0]
) =>
  makeHtml({
    Component: InvitationsCandidatsEnAttente,
    props,
    hydrate: true,
    pageName: 'invitationsCandidatsEnAttente',
    title: 'Invitations en attente',
  })

export const EmailsEnErreurPage = (props: Parameters<typeof EmailsEnErreur>[0]) =>
  makeHtml({
    Component: EmailsEnErreur,
    props,
    hydrate: true,
    pageName: 'emailsEnErreur',
    title: 'Emails en erreur',
  })

export const ProjetsÀRéclamerPage = (props: Parameters<typeof ProjetsÀRéclamer>[0]) =>
  makeHtml({
    Component: ProjetsÀRéclamer,
    props,
    hydrate: true,
    pageName: 'projetsÀRéclamer',
    title: 'Projets à réclamer',
  })

export const LienInvitationPériméPage = (props: Parameters<typeof LienInvitationPérimé>[0]) =>
  makeHtml({
    Component: LienInvitationPérimé,
    props,
    hydrate: true,
    pageName: 'lienInvitationPérimé',
    title: 'Lien invitation périmé',
  })
