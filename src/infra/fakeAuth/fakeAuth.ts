import session from 'express-session'
import QueryString from 'querystring'
import { logger } from '@core/utils'
import { User } from '@entities'
import { EnsureRole, getPermissions, RegisterAuth } from '@modules/authN'
import { GetUserByEmail } from '@modules/users'
import routes from '@routes'
import { FakeLoginPage } from '@views'

export interface FakeAuthDeps {
  getUserByEmail: GetUserByEmail
}

const FAKE_AUTH_COOKIE = 'fake_auth_cookie'

export const makeFakeAuth = ({ getUserByEmail }: FakeAuthDeps) => {
  const registerAuth: RegisterAuth = ({ app, sessionSecret, router }) => {
    app.use(
      session({
        secret: sessionSecret,
        cookie: { maxAge: 60000 },
      })
    )
    // Add middleware that looks for test_auth cookie and loads user with getUserByEmail
    app.use((request, response, next) => {
      if (
        // Theses paths should be prefixed with /static in the future
        request.path.startsWith('/fonts') ||
        request.path.startsWith('/css') ||
        request.path.startsWith('/images') ||
        request.path.startsWith('/scripts') ||
        request.path.startsWith('/main')
      ) {
        next()
        return
      }

      const userEmail = request.cookies[FAKE_AUTH_COOKIE]
      if (userEmail) {
        return getUserByEmail(userEmail).then((userResult) => {
          if (userResult.isOk() && userResult.value !== null) {
            request.user = {
              ...userResult.value,
              accountUrl: '',
              permissions: getPermissions(userResult.value),
            }
          } else {
            logger.error(
              new Error(
                `FakeAuth session open but could not find user in db with email ${userEmail}`
              )
            )

            logOut(response)
            return
          }
          next()
        })
      }

      next()
    })

    router.get(routes.LOGIN, (request, response) => {
      if (request.user) {
        return response.redirect(routes.REDIRECT_BASED_ON_ROLE)
      }

      return response.send(
        FakeLoginPage({
          request,
        })
      )
    })

    router.post(routes.LOGIN_ACTION, async (request, response) => {
      const { email } = request.body

      await getUserByEmail(email).match(
        (user) => {
          if (user === null) {
            return response.redirect(`${routes.LOGIN}?error=Utilisateur inconnu`)
          }

          request.user = { ...user, accountUrl: '', permissions: getPermissions(user) }
          response.cookie(FAKE_AUTH_COOKIE, email, { httpOnly: true })
          return response.redirect(routes.REDIRECT_BASED_ON_ROLE)
        },
        (err) => {
          return response.redirect(
            `${routes.LOGIN}?error=Erreur lors de la récupération de l'utilisateur`
          )
        }
      )
    })

    router.get(routes.LOGOUT_ACTION, (request, response) => {
      logOut(response)
    })

    router.get(routes.REDIRECT_BASED_ON_ROLE, async (req, res) => {
      const user = req.user as User

      if (!user) {
        // Use a retry counter to avoid infinite loop
        const retryCount = Number(req.query.retry || 0)
        if (retryCount > 5) {
          // Too many retries
          return res.redirect('/')
        }
        setTimeout(() => {
          res.redirect(`${routes.REDIRECT_BASED_ON_ROLE}?retry=${retryCount + 1}`)
        }, 200)
        return
      }

      // @ts-ignore
      const queryString = QueryString.stringify(req.query)

      res.redirect(routes.LISTE_PROJETS + '?' + queryString)
    })
  }

  const ensureRole: EnsureRole = (roles) => {
    const roleList = Array.isArray(roles) ? roles : [roles]

    return (req, res, next) => {
      if (!req.user) {
        res.redirect(routes.LOGIN)
        return
      }

      if (!roleList.includes(req.user.role)) {
        res.redirect(routes.REDIRECT_BASED_ON_ROLE)
        return
      }

      next()
    }
  }

  return { registerAuth, ensureRole }
}

function logOut(response) {
  response.clearCookie(FAKE_AUTH_COOKIE)
  response.redirect(routes.LOGIN)
}
