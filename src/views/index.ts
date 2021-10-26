import { makeHtml } from './index.html'
import { Statistiques, ProjectDetails, GarantiesFinancieres } from './pages'

export const StatistiquesPage = (props: Parameters<typeof Statistiques>[0]) =>
  makeHtml({
    Component: Statistiques,
    props,
    hydrate: true,
    pageName: 'statistiques', // This must match the Component name
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
