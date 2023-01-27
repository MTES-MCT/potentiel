import { exporterProjets } from '@infra/sequelize/queries/project/export'
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
import { addQueryParams } from '../../helpers/addQueryParams'

v1Router.get(
  routes.EXPORTER_LISTE_PROJETS_CSV,
  vérifierPermissionUtilisateur(PermissionListerProjets),
  asyncHandler(async (request, response) => {
    const {
      user: { role },
    } = request

    let {
      appelOffreId,
      periodeId,
      familleId,
      recherche,
      classement,
      reclames,
      garantiesFinancieres,
    } = request.query as any

    if (role !== 'admin' && role !== 'dgec-validateur') {
      return response.redirect(addQueryParams(routes.DOWNLOAD_PROJECTS_CSV, { ...request.query }))
    }

    if (!appelOffreId) {
      // Reset the periodId and familleId if there is no appelOffreId
      periodeId = undefined
      familleId = undefined
    }

    const filtres = {
      recherche,
      user: request.user,
      appelOffre: {
        appelOffreId,
        periodeId,
        familleId,
      },
      classement,
      reclames,
      garantiesFinancieres,
    }

    const projets = await exporterProjets({ role, filtres })

    if ((projets && projets.isErr()) || projets === undefined) {
      return new InfraNotAvailableError()
    }

    try {
      const parser = new Parser({ delimiter: ';' })
      const csv = await parser.parse(projets.value)
      const csvFilePath = await writeCsvOnDisk(csv, '/tmp')

      // Delete file when the client's download is complete
      response.on('finish', async () => {
        await fsPromises.unlink(csvFilePath)
      })

      miseAJourStatistiquesUtilisation({
        type: 'exportProjetsTéléchargé',
        données: {
          utilisateur: { role },
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
