import { ModificationRequestPage } from '../views/pages'
import { Controller, HttpRequest } from '../types'

import { projectRepo } from '../dataAccess'

import ROUTES from '../routes'

export default function makeGetDemandePage(): Controller {
  return async (request: HttpRequest) => {
    console.log('Call to getDemandePage received', request.body, request.file)

    if (!request.query.projectId) {
      return {
        redirect: ROUTES.USER_DASHBOARD
      }
    }

    const project = await projectRepo.findById({ id: request.query.projectId })

    if (!project) {
      return {
        redirect: ROUTES.USER_DASHBOARD,
        error: "Le projet demandé n'existe pas"
      }
    }

    return {
      statusCode: 200,
      body: ModificationRequestPage({
        action: request.query.action,
        project,
        success: request.query.success,
        error: request.query.error
      })
    }
  }
}
