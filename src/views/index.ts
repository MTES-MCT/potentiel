import { makeHtml } from './index.html'
import {
  Statistiques,
  ProjectDetails,
  GarantiesFinancieres,
  NewModificationRequest,
  Error,
  ModificationRequest,
  ModificationRequestList,
  AdminStatistiques,
  Home,
  AdemeStatistiques,
  UploadLegacyModificationFiles,
  SignalerDemandeDelai,
} from './pages'

export const StatistiquesPage = (props: Parameters<typeof Statistiques>[0]) =>
  makeHtml({
    Component: Statistiques,
    props,
    hydrate: true,
    pageName: 'statistiques', // This must match the Component name
  })

export const AdminStatistiquesPage = (props: Parameters<typeof AdminStatistiques>[0]) =>
  makeHtml({
    Component: AdminStatistiques,
    props,
    hydrate: true,
    pageName: 'adminStatistiques', // This must match the Component name
  })

export const AdemeStatistiquesPage = (props: Parameters<typeof AdemeStatistiques>[0]) =>
  makeHtml({
    Component: AdemeStatistiques,
    props,
    hydrate: true,
    pageName: 'ademeStatistiques', // This must match the Component name
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
