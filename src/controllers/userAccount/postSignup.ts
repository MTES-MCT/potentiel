import { v1Router } from '../v1Router';
import { createUser, créerProfilUtilisateur } from '../../config';
import { logger } from '../../core/utils';
import { addQueryParams } from '../../helpers/addQueryParams';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { EmailAlreadyUsedError } from '../../modules/shared';
import { GET_SENREGISTRER, POST_SENREGISTRER } from '@potentiel/legacy-routes';

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
});

v1Router.post(
  POST_SENREGISTRER,
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(GET_SENREGISTRER, {
            error:
              error.message ||
              `Une erreur est survenue lors de la création du compte. N'hésitez pas à nous contacter si le problème persiste.`,
            ...request.body,
          }),
        ),
    },
    async (request, response) => {
      const { firstname, lastname, email, utilisateurInvité } = request.body;

      if (utilisateurInvité) {
        return créerProfilUtilisateur({ email, nom: lastname, prénom: firstname }).match(
          () =>
            response.redirect(
              addQueryParams(GET_SENREGISTRER, {
                success: true,
              }),
            ),
          (e) =>
            response.redirect(
              addQueryParams(GET_SENREGISTRER, {
                error:
                  e.message ||
                  `Une erreur est survenue lors de la création du compte. N'hésitez pas à nous contacter si le problème persiste.`,
                ...request.body,
              }),
            ),
        );
      } else {
        const res = await createUser({
          email,
          fullName: `${firstname} ${lastname}`,
          role: 'porteur-projet',
        });

        if (res.isErr()) {
          if (!(res.error instanceof EmailAlreadyUsedError)) {
            logger.error(res.error);
          }

          return response.redirect(
            addQueryParams(GET_SENREGISTRER, {
              error:
                res.error.message ||
                `Une erreur est survenue lors de la création du compte. N'hésitez pas à nous contacter si le problème persiste.`,
              ...request.body,
            }),
          );
        }

        return response.redirect(
          addQueryParams(GET_SENREGISTRER, {
            success: true,
          }),
        );
      }
    },
  ),
);
