import { userRepo } from '../../dataAccess'
import { DREAL } from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import { logger } from '../../core/utils'

const addUserToDrealForTests = async (request: HttpRequest) => {
  const { email, region } = request.body

  if (!email || !region) {
    logger.error('addUserToDrealForTests missing email or region')
    return SystemError('missing email or region')
  }

  const [user] = await userRepo.findAll({ email, role: 'dreal' })

  if (!user) {
    logger.error('addUserToDrealForTests cant find dreal user with this email')
    return SystemError('cant find dreal user with this email')
  }

  const additionRes = await userRepo.addToDreal(user.id, region as DREAL)

  if (additionRes.is_err()) {
    logger.error(additionRes.unwrap_err())
    return SystemError('cant add user to dreal')
  }

  return Success('')
}

export { addUserToDrealForTests }
