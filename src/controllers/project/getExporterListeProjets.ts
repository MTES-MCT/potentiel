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

v1Router.get(
  routes.EXPORTER_LISTE_PROJETS_CSV,
  vérifierPermissionUtilisateur(PermissionListerProjets),
  asyncHandler(async (request, response) => {
    const {
      user: { role },
    } = request

    const listeColonnes = getListeColonnesExportParRole({
      role,
      donnéesProjetParCatégorie,
      catégoriesPermissionsParRôle,
    })

    const projets = await getListeProjetsPourExport({ role, listeColonnes })

    if ((projets && projets.isErr()) || projets === undefined) {
      return new InfraNotAvailableError()
    }

    const selectedFields = listeColonnes.reduce((acc, current) => {
      return [...acc, { label: current, value: current }]
      // TO DO :
      // A voir si on remet ici des noms de colonnes iso à cettes de l'import
      // (sachant que certaines ont pu changer)
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
