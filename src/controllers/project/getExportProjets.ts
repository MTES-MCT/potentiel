import { exporterProjets } from '@infra/sequelize/queries/project/exporter'
import { PermissionListerProjets } from '@modules/project'
import routes from '@routes'
import { miseAJourStatistiquesUtilisation, vérifierPermissionUtilisateur } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import { Parser } from '@json2csv/plainjs'
import { writeCsvOnDisk } from '../../helpers/csv'
import { promises as fsPromises } from 'fs'
import { logger } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

v1Router.get(
  routes.EXPORTER_LISTE_PROJETS_CSV,
  vérifierPermissionUtilisateur(PermissionListerProjets),
  asyncHandler(async (request, response) => {
    const { user } = request

    const {
      appelOffreId,
      periodeId,
      familleId,
      recherche,
      classement,
      reclames,
      garantiesFinancieres,
    } = request.query as any

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
    }

    const exportProjets = await exporterProjets({ user, filtres })

    if (exportProjets && exportProjets.isErr()) {
      return new InfraNotAvailableError()
    }

    try {
      const {
        value: { colonnes, données },
      } = exportProjets

      const parser = new Parser({
        fields: colonnes,
        delimiter: ';',
      })
      const csv = await parser.parse(données)
      const csvFilePath = await writeCsvOnDisk(csv, '/tmp')

      // Delete file when the client's download is complete
      response.on('finish', async () => {
        await fsPromises.unlink(csvFilePath)
      })

      miseAJourStatistiquesUtilisation({
        type: 'exportProjetsTéléchargé',
        données: {
          utilisateur: { role: user.role },
          nombreDeProjets: données.length,
        },
      })

      return response.type('text/csv').sendFile(csvFilePath)
    } catch (error) {
      logger.error(error)
      return response
        .status(500)
        .send(
          "Un problème est survenu pendant la génération de l'export des projets en format csv. Veuillez contacter un administrateur."
        )
    }
  })
)
