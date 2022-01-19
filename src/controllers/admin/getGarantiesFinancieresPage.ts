import asyncHandler from 'express-async-handler'
import { appelOffreRepo } from '../../dataAccess'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { Pagination } from '../../types'
import { listProjects } from '@useCases'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { GarantiesFinancieresPage } from '@views'

const getGarantiesFinancieresPage = asyncHandler(async (request, response) => {
  const {
    appelOffreId,
    periodeId,
    familleId,
    recherche,
    garantiesFinancieres,
    pageSize,
  } = request.query as any
  const { user } = request

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: +request.cookies?.pageSize || 10,
  }
  const pagination = makePagination(request.query, defaultPagination)

  const appelsOffre = await appelOffreRepo.findAll()

  const results = await listProjects({
    user,
    appelOffreId,
    periodeId: appelOffreId ? periodeId : undefined,
    familleId: appelOffreId ? familleId : undefined,
    pagination,
    recherche,
    classement: 'classés',
    reclames: undefined,
    garantiesFinancieres,
  })

  const { projects, existingAppelsOffres, existingPeriodes, existingFamilles } = results

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
