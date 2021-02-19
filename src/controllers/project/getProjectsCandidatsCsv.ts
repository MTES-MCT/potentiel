import { Pagination } from '../../types'
import { listProjects, listUnnotifiedProjects } from '../../useCases'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { parseAsync } from 'json2csv'
import { logger } from '../../core/utils'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { ensureLoggedIn, ensureRole } from '../auth'
import { formatField, writeCsvOnDisk } from '../../helpers/csv'
import { promises as fsPromises } from 'fs'
import { Project } from '../../entities'

const getProjectsNotifiesCsv = asyncHandler(async (request, response) => {
  const { appelOffreId, periodeId, classement, recherche, beforeNotification } = request.query

  if (!appelOffreId || !periodeId) {
    return response
      .status(400)
      .send(
        `Pour exporter la liste des projets notifiés, vous devez d'abord sélectionner un appel d'offre ainsi qu'une période.`
      )
  }

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: 1000000,
  }

  const pagination = makePagination(request.query, defaultPagination)

  const projetsCandidats = [
    { name: 'Candidat' },
    { name: 'nomProjet' },
    { name: 'puissance' },
    { name: 'familleId' },
    { name: 'departementProjet' },
    { name: 'regionProjet' },
  ]

  const fields = projetsCandidats.map((field) => formatField(field))
  fields.unshift({ label: 'Titre', value: 'appelOffre.title' })

  try {
    const {
      projects: { items: projects },
    }: any =
      beforeNotification === 'true'
        ? await listUnnotifiedProjects({
            appelOffreId,
            periodeId,
            pagination,
            recherche,
            classement,
          })
        : await listProjects({
            user: request.user,
            appelOffreId,
            periodeId,
            familleId: undefined,
            pagination,
            recherche: undefined,
            classement: 'classés',
            garantiesFinancieres: undefined,
          })

    const sortedProjects = _sortProjectsByRegionsAndDepartements(projects)

    const csv = await parseAsync(sortedProjects, { fields, delimiter: ';' })
    const csvFilePath = await writeCsvOnDisk(csv, '/tmp')

    response.on('finish', async () => {
      await fsPromises.unlink(csvFilePath)
    })

    return response.sendFile(csvFilePath)
  } catch (e) {
    logger.error(e)
    response
      .status(500)
      .send(
        "Un problème est survenu pendant la génération de l'export des projets en format csv. Veuillez contacter un administrateur."
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
  routes.ADMIN_DOWNLOAD_PROJECTS_CANDIDATS_CSV,
  ensureLoggedIn(),
  ensureRole('admin'),
  getProjectsNotifiesCsv
)
