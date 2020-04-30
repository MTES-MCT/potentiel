import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { retrievePassword } from '../useCases'
import moment from 'moment'

const FORMAT_DATE = 'DD/MM/YYYY'

const postRetrievePassword = async (request: HttpRequest) => {
  // console.log('Call to sendCandidateNotifications received', request.body)

  const { email } = request.body

  if (!email) {
    return Redirect(ROUTES.FORGOTTEN_PASSWORD, {
      error: 'Merci de saisir une adresse email.',
    })
  }

  try {
    await retrievePassword({
      email,
    })
    return Redirect(ROUTES.FORGOTTEN_PASSWORD, {
      success:
        "Si l'adresse saisie correspond bien à un compte Potentiel, vous recevrez un courrier électronique avec des instructions pour choisir un nouveau mot de passe.",
    })
  } catch (error) {
    return Redirect(ROUTES.FORGOTTEN_PASSWORD, {
      error: "Votre demande n'a pas pu être traitée. Merci de réessayer.",
    })
  }
}
export { postRetrievePassword }
