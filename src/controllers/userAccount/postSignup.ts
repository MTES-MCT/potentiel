import routes from '@routes'
import { v1Router } from '../v1Router'
import { créerProfilUtilisateur } from '@config'
import { addQueryParams } from '../../helpers/addQueryParams'
import * as yup from 'yup'
import safeAsyncHandler from '../helpers/safeAsyncHandler'

const schema = yup.object({
  body: yup.object({
    firstname: yup.string().required('Ce champ est obligatoire'),
    lastname: yup.string().required('Ce champ est obligatoire'),
    email: yup
      .string()
      .required('Ce champ est obligatoire')
      .email(`L'adresse courriel renseignée n'est pas valide`),
    utilisateurInvité: yup.boolean().required(),
  }),
})

v1Router.post(
  routes.POST_SIGNUP,
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.SIGNUP, {
            error:
              error.message ||
              `Une erreur est survenue lors de la création du compte. N'hésitez pas à nous contacter si le problème persiste.`,
            ...request.body,
          })
        ),
    },
    async (request, response) => {
      const { firstname, lastname, email } = request.body
      return créerProfilUtilisateur({ email, nom: lastname, prénom: firstname }).match(
        () =>
          response.redirect(
            addQueryParams(routes.SIGNUP, {
              success: true,
            })
          ),
        (e) => {
          console.error(e)
          response.redirect(
            addQueryParams(routes.SIGNUP, {
              error:
                e.message ||
                `Une erreur est survenue lors de la création du compte. N'hésitez pas à nous contacter si le problème persiste.`,
              ...request.body,
            })
          )
        }
      )
    }
  )
)
