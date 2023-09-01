import routes from '../../routes';
import { parseAsync } from 'json2csv';
import { logger } from '../../core/utils';
import { v1Router } from '../v1Router';
import { ensureRole, getDonnéesPourPageNotificationCandidats } from '../../config';
import asyncHandler from '../helpers/asyncHandler';
import { formatField, writeCsvOnDisk } from '../../helpers/csv';
import { promises as fsPromises } from 'fs';
import { getPagination } from '../helpers';
import { ProjectListItem } from '../../modules/project';

const getProjectsLaureatsCsv = asyncHandler(async (request, response) => {
  const { appelOffreId, periodeId, recherche, beforeNotification, classement } =
    request.query as any;

  if (!appelOffreId || !periodeId) {
    return response
      .status(400)
      .send(
        `Pour exporter la liste des projets lauréats, vous devez d'abord sélectionner un appel d'offre ainsi qu'une période.`,
      );
  }

  const pagination = getPagination(request);

  const projetsCandidats = [
    { dataField: 'nomCandidat' },
    { dataField: 'nomProjet' },
    { dataField: 'classe' },
    { dataField: 'puissance' },
    { dataField: 'familleId' },
    { dataField: 'departementProjet' },
    { dataField: 'regionProjet' },
  ];

  try {
    const résultat =
      beforeNotification === 'true'
        ? await getDonnéesPourPageNotificationCandidats({
            appelOffreId,
            periodeId,
            pagination,
            recherche,
            classement,
          })
        : null;

    if (!résultat) {
      return response.send('Aucun projet lauréat sur cette période');
    }

    const {
      projetsPériodeSélectionnée: { items: projects },
    } = résultat;

    if (projects.length === 0) {
      return response.send('Aucun projet lauréat sur cette période');
    }

    const sortedProjects = _sortProjectsByRegionsAndDepartements(projects);

    const fields = projetsCandidats.map((field) => formatField(field));
    const title = `Liste des lauréats de la ${
      projects[0].appelOffre && projects[0].appelOffre.periode.title
    } période d'appel d'offres portant sur ${
      projects[0].appelOffre && projects[0].appelOffre.title
    }`;
    fields.unshift({ label: 'Titre', value: () => title });
    console.log(sortedProjects, fields);
    const csv = await parseAsync(sortedProjects, { fields, delimiter: ';' });
    const csvFilePath = await writeCsvOnDisk(csv, '/tmp');

    response.on('finish', async () => {
      await fsPromises.unlink(csvFilePath);
    });

    return response.type('text/csv').sendFile(csvFilePath);
  } catch (e) {
    logger.error(e);
    response
      .status(500)
      .send(
        "Un problème est survenu pendant la génération de l'export des projets lauréats. Veuillez contacter un administrateur.",
      );
  }
});

function _sortProjectsByRegionsAndDepartements(projects: ProjectListItem[]) {
  return projects.sort((p1, p2): number => {
    if (p1.regionProjet > p2.regionProjet) return 1;
    if (p1.regionProjet < p2.regionProjet) return -1;
    if (p1.departementProjet > p2.departementProjet) return 1;
    if (p1.departementProjet < p2.departementProjet) return -1;
    return 0;
  });
}

v1Router.get(
  routes.ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV,
  ensureRole(['admin', 'dgec-validateur']),
  getProjectsLaureatsCsv,
);
