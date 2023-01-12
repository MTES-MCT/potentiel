import { getListeProjetsPourExport } from '@infra/sequelize/queries/project/export'
import { PermissionListerProjets } from '@modules/project'
import routes from '@routes'
import { miseAJourStatistiquesUtilisation, vérifierPermissionUtilisateur } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import { parseAsync } from 'json2csv'
import { writeCsvOnDisk } from 'src/helpers/csv'
import { promises as fsPromises } from 'fs'
import { logger } from '@core/utils'
import {
  catégoriesPermissionsParRôle,
  donnéesProjetParCatégorie,
  getListeColonnesExportParRole,
} from '@modules/project/queries/exporterProjets'
import { InfraNotAvailableError } from '@modules/shared'
import { addQueryParams } from 'src/helpers/addQueryParams'

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

    if (!['admin', 'dgec-validateur'].includes(role)) {
      return response.redirect(addQueryParams(routes.DOWNLOAD_PROJECTS_CSV, { ...request.query }))
    }

    const listeColonnes = getListeColonnesExportParRole({
      //@ts-ignore
      role,
      donnéesProjetParCatégorie,
      catégoriesPermissionsParRôle,
    })

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

    //@ts-ignore
    const projets = await getListeProjetsPourExport({ role, listeColonnes, filtres })

    if ((projets && projets.isErr()) || projets === undefined) {
      return new InfraNotAvailableError()
    }

    const selectedFields = listeColonnes.reduce((acc, current) => {
      if (current === 'dateEnvoi') {
        return [
          ...acc,
          { label: 'Date de soumission sur Potentiel des garanties financières', value: current },
        ]
      }
      if (current === 'dateConstitution') {
        return [
          ...acc,
          { label: 'Date déclarée par le PP de dépôt des garanties financières', value: current },
        ]
      }
      return [...acc, { label: current, value: current }]
    }, [])

    try {
      const csv = await parseAsync(projets.value, { fields: selectedFields, delimiter: ';' })
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
