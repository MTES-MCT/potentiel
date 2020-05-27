import _ from 'lodash'

import { getUserProject } from '../useCases'
import { projectRepo, projectAdmissionKeyRepo } from '../dataAccess'
import { Redirect, Success, NotFoundError } from '../helpers/responses'
import { Controller, HttpRequest } from '../types'
import { DrealListPage } from '../views/pages'
import ROUTES from '../routes'

const getDrealPage = async (request: HttpRequest) => {
  // console.log('Call to getDrealPage received', request.body, request.file)
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  return Success(DrealListPage({ request, users: [] }))
}

export { getDrealPage }
