import {
  appelOffreRepo,
  ContextSpecificProjectListFilter,
  projectRepo,
  userRepo,
} from '@dataAccess'
import asyncHandler from '../helpers/asyncHandler'
import { makePagination } from '../../helpers/paginate'
import routes from '@routes'
import { Pagination } from '../../types'
import { ensureRole, listerProjetsPourAdmin, listProjects } from '@config'
import { v1Router } from '../v1Router'
import { GarantiesFinancieresPage } from '@views'
import { Request } from 'express'

const getGarantiesFinancieresPage = asyncHandler(async (request, response) => {
  const { appelOffreId, periodeId, familleId, recherche, garantiesFinancieres, pageSize } =
    request.query as any
  const { user } = request

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: +request.cookies?.pageSize || 10,
  }
  const pagination = makePagination(request.query, defaultPagination)

  const appelsOffre = await appelOffreRepo.findAll()

  const filtres = {
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
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
      maxAge: 1000 * 60 * 60 * 24 * 30 * 3, // 3 months
      httpOnly: true,
    })
  }

  response.send(
    GarantiesFinancieresPage({
      request,
      projects,
      existingAppelsOffres,
      existingPeriodes,
      existingFamilles,
      appelsOffre,
    })
  )
})

v1Router.get(routes.ADMIN_GARANTIES_FINANCIERES, ensureRole(['dreal']), getGarantiesFinancieresPage)
