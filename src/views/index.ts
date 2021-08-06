import { makeHtml } from './index.html'
import { Statistiques } from './pages'

export const StatistiquesPage = (props: Parameters<typeof Statistiques>[0]) =>
  makeHtml({
    Component: Statistiques,
    props,
    hydrate: true,
    pageName: 'statistiques', // This must match the Component name
  })
