import { exporterProjets } from '../../infra/sequelize/queries/project/exporter';
import routes from '../../routes';
import { miseAJourStatistiquesUtilisation, vérifierPermissionUtilisateur } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';
import { writeCsvOnDisk } from '../../helpers/csv';
import { promises as fsPromises } from 'fs';
import { logger } from '../../core/utils';
import { PermissionExporterProjets } from '../../modules/project/queries';
import { ExportCSV } from '@potentiel-libraries/csv';

v1Router.get(
  routes.EXPORTER_LISTE_PROJETS_CSV,
  vérifierPermissionUtilisateur(PermissionExporterProjets),
  asyncHandler(async (request, response) => {
    const { user } = request;

    const {
      appelOffreId,
      periodeId,
      familleId,
      recherche,
      classement,
      reclames,
      garantiesFinancieres,
    } = request.query as any;

    const filtres = {
      recherche,
      user: request.user,
      appelOffre: {
        appelOffreId,
        periodeId: appelOffreId ? periodeId : undefined,
        familleId: appelOffreId ? familleId : undefined,
      },
      classement,
      reclames,
      garantiesFinancieres,
    };

    try {
      const { colonnes, données } = await exporterProjets({ user, filtres });

      const csv = await ExportCSV.parseJson({
        data: données,
        fields: colonnes,
        parserOptions: { delimiter: ';' },
      });

      const csvFilePath = await writeCsvOnDisk(csv, '/tmp');

      // Delete file when the client's download is complete
      response.on('finish', async () => {
        await fsPromises.unlink(csvFilePath);
      });

      miseAJourStatistiquesUtilisation({
        type: 'exportProjetsTéléchargé',
        données: {
          utilisateur: { role: user.role },
          nombreDeProjets: données.length,
        },
      });

      return response.type('text/csv').sendFile(csvFilePath);
    } catch (error) {
      logger.error(error);
      return response
        .status(500)
        .send(
          "Un problème est survenu pendant la génération de l'export des projets en format csv. Veuillez contacter un administrateur.",
        );
    }
  }),
);
