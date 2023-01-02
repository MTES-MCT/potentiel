import asyncHandler from '../helpers/asyncHandler'
import { makePagination } from '../../helpers/paginate'
import routes from '@routes'
import { Pagination } from '../../types'
import { listerProjetsPourAdmin, listProjects } from '@config'
import { v1Router } from '../v1Router'
import { ListeProjetsPage } from '@views'
import { userIs } from '@modules/users'
import { PermissionListerProjets } from '@modules/project'
import { vérifierPermissionUtilisateur } from '../helpers'
import {
  projectRepo,
  appelOffreRepo,
  ContextSpecificProjectListFilter,
  userRepo,
} from '@dataAccess'
import { Request } from 'express'

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
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
  }

  const projects = ['admin', 'dgec-validateur'].includes(user.role)
    ? await listerProjetsPourAdmin(filtres)
    : await listProjects(filtres)

  const getUserSpecificProjectListFilter = async (
    user: Request['user']
  ): Promise<ContextSpecificProjectListFilter> => {
    switch (user.role) {
      case 'dreal':
        const regions = await userRepo.findDrealsForUser(user.id)

        return {
          regions,
        }
      case 'porteur-projet':
        return {
          userId: user.id,
        }
      case 'admin':
      case 'dgec-validateur':
      case 'acheteur-obligé':
      case 'ademe':
      case 'cre':
      case 'caisse-des-dépôts':
        return {
          isNotified: true,
        }
    }
  }

  const userSpecificProjectListFilter = await getUserSpecificProjectListFilter(user)

  const existingAppelsOffres = await projectRepo.findExistingAppelsOffres(
    userSpecificProjectListFilter
  )

  const existingPeriodes =
    appelOffreId &&
    (await projectRepo.findExistingPeriodesForAppelOffre(
      appelOffreId,
      userSpecificProjectListFilter
    ))

  const existingFamilles =
    appelOffreId &&
    (await projectRepo.findExistingFamillesForAppelOffre(
      appelOffreId,
      userSpecificProjectListFilter
    ))

  if (pageSize) {
    // Save the pageSize in a cookie
    response.cookie('pageSize', pageSize, {
      maxAge: TROIS_MOIS,
      httpOnly: true,
    })
  }

  const appelsOffre = await appelOffreRepo.findAll()

  response.send(
    ListeProjetsPage({
      request,
      projects,
      existingAppelsOffres,
      existingPeriodes,
      existingFamilles,
      appelsOffre,
    })
  )
})

v1Router.get(
  routes.LISTE_PROJETS,
  vérifierPermissionUtilisateur(PermissionListerProjets),
  getProjectListPage
)
