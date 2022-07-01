import asyncHandler from '../helpers/asyncHandler'
import routes from '@routes'
import { v1Router } from '../v1Router'
import { logger, ResultAsync } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import * as yup from 'yup'
import { ValidationError } from 'yup'
import Mailjet from 'node-mailjet'

const { MJ_APIKEY_PUBLIC = '', MJ_APIKEY_PRIVATE = '' } = process.env

const requestBodySchema = yup.object({
  email: yup
    .string()
    .required('Ce champ est obligatoire')
    .email(`L'adresse courriel renseignée n'est pas valide`),
})

v1Router.post(
  routes.POST_SINSCRIRE_LETTRE_INFORMATION,
  asyncHandler(async (request, response) => {
    try {
      requestBodySchema.validateSync(request.body, { abortEarly: false })
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.redirect(
          addQueryParams(routes.ABONNEMENT_LETTRE_INFORMATION, {
            ...request.body,
            ...error.inner.reduce(
              (errors, { path, message }) => ({ ...errors, [`error-${path}`]: message }),
              {}
            ),
          })
        )
      }
    }

    const { email } = request.body

    const mailjet = Mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE)

    const inscription = await ResultAsync.fromPromise(
      mailjet
        .post('contact')
        .id(email)
        .action('managecontactslists')
        .request({
          ContactsLists: [
            {
              ListID: 10274700,
              Action: 'addnoforce',
            },
          ],
        }),
      (e) => new Error()
    )

    if (inscription.isErr()) {
      logger.error(inscription.error)

      return response.redirect(
        addQueryParams(routes.ABONNEMENT_LETTRE_INFORMATION, {
          error:
            inscription.error.message ||
            `Une erreur est survenue lors de l'inscription à la lettre d'information'. N'hésitez pas à nous contacter si le problème persiste.`,
          ...request.body,
        })
      )
    }

    return response.redirect(
      addQueryParams(routes.ABONNEMENT_LETTRE_INFORMATION, {
        success: true,
      })
    )
  })
)
