import { Success } from '../helpers/responses'
import { HttpRequest } from '../types'
import { LoginPage } from '../views/pages'

const getLoginPage = async (request: HttpRequest) => {
  return Success(
    LoginPage({
      request
    })
  )
}
export { getLoginPage }
