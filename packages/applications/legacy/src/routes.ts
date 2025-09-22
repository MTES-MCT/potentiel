import querystring from 'querystring';
import type { Project } from './entities';

class routes {
  static PROJECT_DETAILS = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/details.html';
    if (projectId) {
      return route.replace(':projectId', encodeURIComponent(projectId));
    } else return route;
  };

  static EXPORTER_LISTE_PROJETS_CSV = '/export-liste-projets.csv';

  /**
   * @deprecated Lien vers la page liste des projets (legacy)
   */
  static LISTE_PROJETS = '/projets.html';
}
export default routes;
