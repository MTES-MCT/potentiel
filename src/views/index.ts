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
} from './pages'

export const StatistiquesPage = (props: Parameters<typeof Statistiques>[0]) =>
  makeHtml({
    Component: Statistiques,
    props,
    hydrate: false,
  })

export const AdminStatistiquesPage = (props: Parameters<typeof AdminStatistiques>[0]) =>
  makeHtml({
    Component: AdminStatistiques,
    props,
    hydrate: false,
  })

export const AdemeStatistiquesPage = (props: Parameters<typeof AdemeStatistiques>[0]) =>
  makeHtml({
    Component: AdemeStatistiques,
    props,
    hydrate: false,
  })

export const ProjectDetailsPage = (props: Parameters<typeof ProjectDetails>[0]) =>
  makeHtml({
    Component: ProjectDetails,
    props,
    hydrate: true,
    pageName: 'projectDetails', // This must match the Component name
  })

export const GarantiesFinancieresPage = (props: Parameters<typeof GarantiesFinancieres>[0]) =>
  makeHtml({
    Component: GarantiesFinancieres,
    props,
    hydrate: true,
    pageName: 'garantiesFinancieres', // This must match the Component name
  })

export const NewModificationRequestPage = (props: Parameters<typeof NewModificationRequest>[0]) =>
  makeHtml({
    Component: NewModificationRequest,
    props,
    hydrate: true,
    pageName: 'newModificationRequest', // This must match the Component name
  })

export const ErrorPage = (props: Parameters<typeof Error>[0]) =>
  makeHtml({
    Component: Error,
    props,
    hydrate: false,
  })

export const ModificationRequestPage = (props: Parameters<typeof ModificationRequest>[0]) =>
  makeHtml({
    Component: ModificationRequest,
    props,
    hydrate: true,
    pageName: 'modificationRequest', // This must match the Component name
  })

export const DemanderDelaiPage = (props: Parameters<typeof DemanderDelai>[0]) =>
  makeHtml({
    Component: DemanderDelai,
    props,
    hydrate: true,
    pageName: 'demanderDelai',
  })

export const DemanderAbandonPage = (props: Parameters<typeof DemanderAbandon>[0]) =>
  makeHtml({
    Component: DemanderAbandon,
    props,
    hydrate: true,
    pageName: 'demanderAbandon',
  })

export const ChangerProducteurPage = (props: Parameters<typeof ChangerProducteur>[0]) =>
  makeHtml({
    Component: ChangerProducteur,
    props,
    hydrate: true,
    pageName: 'changerProducteur',
  })

export const DemandeAbandonPage = (props: Parameters<typeof DemandeAbandon>[0]) =>
  makeHtml({
    Component: DemandeAbandon,
    props,
    hydrate: true,
    pageName: 'demandeAbandon', // This must match the Component name
  })

export const ModificationRequestListPage = (props: Parameters<typeof ModificationRequestList>[0]) =>
  makeHtml({
    Component: ModificationRequestList,
    props,
    hydrate: true,
    pageName: 'modificationRequestList', // This must match the Component name
  })

export const HomePage = (props: Parameters<typeof Home>[0]) =>
  makeHtml({
    Component: Home,
    props,
    hydrate: true,
    pageName: 'home', // This must match the Component name
  })

export const UploadLegacyModificationFilesPage = (
  props: Parameters<typeof UploadLegacyModificationFiles>[0]
) =>
  makeHtml({
    Component: UploadLegacyModificationFiles,
    props,
    hydrate: false,
  })

export const SignalerDemandeDelaiPage = (props: Parameters<typeof SignalerDemandeDelai>[0]) =>
  makeHtml({
    Component: SignalerDemandeDelai,
    props,
    hydrate: true,
    pageName: 'signalerDemandeDelai', // This must match the Component name
  })

export const SignalerDemandeAbandonPage = (props: Parameters<typeof SignalerDemandeAbandon>[0]) =>
  makeHtml({
    Component: SignalerDemandeAbandon,
    props,
    hydrate: true,
    pageName: 'signalerDemandeAbandon', // This must match the Component name
  })

export const SignalerDemandeRecoursPage = (props: Parameters<typeof SignalerDemandeRecours>[0]) =>
  makeHtml({
    Component: SignalerDemandeRecours,
    props,
    hydrate: true,
    pageName: 'signalerDemandeRecours', // This must match the Component name
  })

export const SignupPage = (props: Parameters<typeof Signup>[0]) =>
  makeHtml({
    Component: Signup,
    props,
    hydrate: false,
  })

export const DrealListPage = (props: Parameters<typeof DrealList>[0]) =>
  makeHtml({
    Component: DrealList,
    props,
    hydrate: true,
    pageName: 'drealList', // This must match the Component name
  })

export const PartnersListPage = (props: Parameters<typeof PartnersList>[0]) =>
  makeHtml({
    Component: PartnersList,
    props,
    hydrate: true,
    pageName: 'partnersList', // This must match the Component name
  })

export const ImporterListingEDFPage = (props: Parameters<typeof ImporterListingEDF>[0]) =>
  makeHtml({
    Component: ImporterListingEDF,
    props,
    hydrate: false,
  })

export const ImporterListingEnedisPage = (props: Parameters<typeof ImporterListingEnedis>[0]) =>
  makeHtml({
    Component: ImporterListingEnedis,
    props,
    hydrate: false,
  })

export const AbonnementLettreInformationPage = (
  props: Parameters<typeof AbonnementLettreInformation>[0]
) =>
  makeHtml({
    Component: AbonnementLettreInformation,
    props,
    hydrate: false,
  })
