import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { updateNewRulesOptIn } from '../../config'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { logger } from '../../core/utils/logger';

v1Router.post(
    routes.CHANGER_CDC,

    ensureRole('porteur-projet'),

    asyncHandler(async (request, response) => {
        const {body: {projectId}, user: optedInBy} = request

        const result = updateNewRulesOptIn({
            projectId,
            optedInBy
        })

        const handleSuccess = () => {
            response.redirect(
                routes.SUCCESS_OR_ERROR_PAGE({
                    success: 'Votre demande de changement de modalités d\'instructions a bien été enregistrée.',
                    redirectUrl: routes.PROJECT_DETAILS(projectId),
                    redirectTitle: 'Retourner à la page projet',
                })
            )
        }

        const handleError = (error :Error) => {
            logger.error(error)
            return response.redirect(
                addQueryParams(routes.PROJECT_DETAILS(projectId), {
                    error: "Votre demande de changement n'a pas pu être prise en compte. Merci de réessayer. Si le problème persiste nous vous invitons à contacter nos équipes.",
                })
            )
        }

        return await result.match(handleSuccess, handleError)
    })
)