import { logger } from '@core/utils'
import { userRepo } from '../../dataAccess'
import { DREAL } from '@entities'
import { testRouter } from './testRouter'

testRouter.post('/test/addUserToDreal', async (request, response) => {
  const { email, region } = request.body

  if (!email || !region) {
    logger.error('addUserToDrealForTests missing email or region')
    return response.status(500).send('missing email or region')
  }

  const [user] = await userRepo.findAll({ email, role: 'dreal' })

  if (!user) {
    logger.error('addUserToDrealForTests cant find dreal user with this email')
    return response.status(500).send('cant find dreal user with this email')
  }

  const additionRes = await userRepo.addToDreal(user.id, region as DREAL)

  if (additionRes.is_err()) {
    logger.error(additionRes.unwrap_err())
    return response.status(500).send('cant add user to dreal')
  }

  return response.send('')
})
