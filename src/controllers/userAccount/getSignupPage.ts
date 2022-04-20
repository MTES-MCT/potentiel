import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { SignupPage } from '@views'

v1Router.get(
  routes.SIGNUP,
  asyncHandler(async ({ user, query }, response) => {
    const validationErrors: Array<{ [fieldName: string]: string }> = Object.entries(query).reduce(
      (errors, [key, value]) => ({
        ...errors,
        ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
      }),
      [] as Array<{ [fieldName: string]: string }>
    )

    return response.send(SignupPage({ user, validationErrors }))
  })
)
