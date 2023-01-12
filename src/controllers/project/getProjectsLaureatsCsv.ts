import { PaginatedList, Pagination } from '../../types'
import { listUnnotifiedProjects } from '@useCases'
import { makePagination } from '../../helpers/paginate'
import routes from '@routes'
import { parseAsync } from 'json2csv'
import { logger } from '@core/utils'
import { v1Router } from '../v1Router'
import { ensureRole, listProjects } from '@config'
import asyncHandler from '../helpers/asyncHandler'
import { formatField, writeCsvOnDisk } from '../../helpers/csv'
import { promises as fsPromises } from 'fs'
import { Project } from '@entities'

const getProjectsLaureatsCsv = asyncHandler(async (request, response) => {
  const { appelOffreId, periodeId, recherche, beforeNotification } = request.query as any

  if (!appelOffreId || !periodeId) {
    return response
      .status(400)
      .send(
        `Pour exporter la liste des projets lauréats, vous devez d'abord sélectionner un appel d'offre ainsi qu'une période.`
      )
  }

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: 1000000,
  }

  const pagination = makePagination(request.query, defaultPagination)

  const projetsCandidats = [
    { dataField: 'appelOffreId' },
    { dataField: 'periodeId' },
    { dataField: 'familleId' },
    { dataField: 'classe' },
    { dataField: 'nomCandidat' },
    { dataField: 'nomProjet' },
    { dataField: 'puissance' },
    { dataField: 'departementProjet' },
    { dataField: 'regionProjet' },
  ]

  try {
    const getProjects = async ({
      appelOffreId,
      periodeId,
      recherche,
      beforeNotification,
    }): Promise<PaginatedList<Project> | null> => {
      return beforeNotification === 'false'
        ? await listProjects({
            user: request.user,
            appelOffreId,
            periodeId,
            familleId: undefined,
            pagination,
            recherche: undefined,
            classement: 'classés',
            garantiesFinancieres: undefined,
          })
        : await listUnnotifiedProjects({
            appelOffreId,
            periodeId,
            pagination,
            recherche,
            classement: 'classés',
          })
    }

    const projects = await getProjects({ appelOffreId, periodeId, recherche, beforeNotification })

    if (!projects || projects?.itemCount === 0)
      return response.send('Aucun projet lauréat sur cette période')

    const sortedProjects = _sortProjectsByRegionsAndDepartements(projects?.items)

    const fields = projetsCandidats.map((field) => formatField(field))

    const csv = await parseAsync(sortedProjects, { fields, delimiter: ';' })
    const csvFilePath = await writeCsvOnDisk(csv, '/tmp')

    response.on('finish', async () => {
      await fsPromises.unlink(csvFilePath)
    })

    return response.type('text/csv').sendFile(csvFilePath)
  } catch (e) {
    logger.error(e)
    response
      .status(500)
      .send(
        "Un problème est survenu pendant la génération de l'export des projets lauréats. Veuillez contacter un administrateur."
      )
  }
})

function _sortProjectsByRegionsAndDepartements(projects: Project[]) {
  return projects.sort((p1, p2): number => {
    if (p1.regionProjet > p2.regionProjet) return 1
    if (p1.regionProjet < p2.regionProjet) return -1
    if (p1.departementProjet > p2.departementProjet) return 1
    if (p1.departementProjet < p2.departementProjet) return -1
    return 0
  })
}

v1Router.get(
  routes.ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV,
  ensureRole(['admin', 'dgec-validateur']),
  getProjectsLaureatsCsv
)
