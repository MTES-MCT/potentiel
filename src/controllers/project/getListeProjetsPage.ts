import asyncHandler from '../helpers/asyncHandler'
import { makePagination } from '../../helpers/paginate'
import routes from '@routes'
import { Pagination } from '../../types'
import { v1Router } from '../v1Router'
import { ListeProjetsPage } from '@views'
import { userIs } from '@modules/users'
import { PermissionListerProjets } from '@modules/project'
import { getOptionsFiltresParAOs, vérifierPermissionUtilisateur } from '../helpers'
import { appelOffreRepo } from '@dataAccess'
import { listerProjets } from '@infra/sequelize/queries'

const TROIS_MOIS = 1000 * 60 * 60 * 24 * 30 * 3

const getProjectListPage = asyncHandler(async (request, response) => {
  let {
    appelOffreId,
    periodeId,
    familleId,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
    pageSize,
  } = request.query as any
  const { user } = request

  // Set default filter on classés for admins
  if (userIs(['admin', 'dgec-validateur', 'dreal'])(user) && typeof classement === 'undefined') {
    classement = 'classés'
    request.query.classement = 'classés'
  }

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: +request.cookies?.pageSize || 10,
  }
  const pagination = makePagination(request.query, defaultPagination)

  if (!appelOffreId) {
    // Reset the periodId and familleId if there is no appelOffreId
    periodeId = undefined
    familleId = undefined
  }

  const filtres = {
    recherche,
    user,
    appelOffre: {
      appelOffreId,
      periodeId,
      familleId,
    },
    classement,
    reclames,
    garantiesFinancieres,
  }

  const projects = await listerProjets({ user, filtres, pagination })

  if (pageSize) {
    // Save the pageSize in a cookie
    response.cookie('pageSize', pageSize, {
      maxAge: TROIS_MOIS,
      httpOnly: true,
    })
  }

  const appelsOffre = await appelOffreRepo.findAll()

  const optionsFiltresParAOs = await getOptionsFiltresParAOs({ user, appelOffreId })

  response.send(
    ListeProjetsPage({
      request,
      projects,
      appelsOffre,
      ...optionsFiltresParAOs,
    })
  )
})

v1Router.get(
  routes.LISTE_PROJETS,
  vérifierPermissionUtilisateur(PermissionListerProjets),
  getProjectListPage
)
