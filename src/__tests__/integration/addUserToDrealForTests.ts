import {
  projectRepo,
  userRepo,
  projectAdmissionKeyRepo,
} from '../../dataAccess'
import {
  User,
  makeProject,
  makeProjectAdmissionKey,
  DREAL,
} from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import ROUTES from '../../routes'
import makeFakeProject from '../fixtures/project'
import { createUser } from './helpers/createUser'

const addUserToDrealForTests = async (request: HttpRequest) => {
  // console.log('addUserToDrealForTests', request, request.user)
  const { email, region } = request.body

  if (!email || !region) {
    console.log('addUserToDrealForTests missing email or region')
    return SystemError('missing email or region')
  }

  const [user] = await userRepo.findAll({ email, role: 'dreal' })

  if (!user) {
    console.log('addUserToDrealForTests cant find dreal user with this email')
    return SystemError('cant find dreal user with this email')
  }

  const additionRes = await userRepo.addToDreal(user.id, region as DREAL)

  if (additionRes.is_err()) {
    console.log(
      'addUserToDrealForTests cant add user to dreal',
      additionRes.unwrap_err()
    )
    return SystemError('cant add user to dreal')
  }

  return Success('')
}

export { addUserToDrealForTests }
