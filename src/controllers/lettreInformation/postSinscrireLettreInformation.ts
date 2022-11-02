import routes from '@routes'
import { v1Router } from '../v1Router'
import { logger, ResultAsync } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import * as yup from 'yup'
import Mailjet from 'node-mailjet'
import safeAsyncHandler from '../helpers/safeAsyncHandler'

const { MJ_APIKEY_PUBLIC = '', MJ_APIKEY_PRIVATE = '' } = process.env

const schema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .required('Ce champ est obligatoire')
      .email(`L'adresse courriel renseignée n'est pas valide`),
  }),
})

v1Router.post(
  routes.POST_SINSCRIRE_LETTRE_INFORMATION,
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.ABONNEMENT_LETTRE_INFORMATION, {
            error: error.message,
            ...request.body,
          })
        ),
    },
    async (request, response) => {
      const { email } = request.body

      const mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE)

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
        (e) => e as Error
      )

      if (inscription.isErr()) {
        logger.error(inscription.error)

        return response.redirect(
          addQueryParams(routes.ABONNEMENT_LETTRE_INFORMATION, {
            error: `Une erreur est survenue lors de l'inscription à la lettre d'information'. N'hésitez pas à nous contacter si le problème persiste.`,
            ...request.body,
          })
        )
      }

      return response.redirect(
        addQueryParams(routes.ABONNEMENT_LETTRE_INFORMATION, {
          success: true,
        })
      )
    }
  )
)
