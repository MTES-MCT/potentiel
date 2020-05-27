import _ from 'lodash'

import { userRepo, projectAdmissionKeyRepo } from '../dataAccess'
import { Redirect, Success, NotFoundError } from '../helpers/responses'
import { Controller, HttpRequest } from '../types'
import { DrealListPage } from '../views/pages'
import ROUTES from '../routes'

const getDrealPage = async (request: HttpRequest) => {
  // console.log('Call to getDrealPage received', request.body, request.file)
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  // Get all dreal users
  const drealUsers = await userRepo.findAll({ role: 'dreal' })
  const users = await Promise.all(
    drealUsers.map(async (user) => {
      const dreals = await userRepo.findDrealsForUser(user.id)
      return { user, dreals }
    })
  )

  const drealUserEmails = drealUsers.map((item) => item.email)

  // Get all invitations for dreals
  const drealInvitations = await projectAdmissionKeyRepo.findAll({ dreal: -1 })
  const invitations = drealInvitations.filter(
    (item) => !drealUserEmails.includes(item.email)
  )

  return Success(DrealListPage({ request, users, invitations }))
}

export { getDrealPage }
