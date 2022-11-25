import makeSequelizeStore from 'connect-session-sequelize'
import session from 'express-session'
import Keycloak from 'keycloak-connect'
import QueryString from 'querystring'
import { logger } from '@core/utils'
import { User } from '@entities'
import { EnsureRole, RegisterAuth } from '@modules/authN'
import { CreateUser, GetUserByEmail } from '@modules/users'
import routes from '@routes'
import { makeAttachUserToRequestMiddleware } from './attachUserToRequestMiddleware'
import { miseAJourStatistiquesUtilisation } from '../../controllers/helpers'
import { isDevEnv } from '@config'

export interface KeycloakAuthDeps {
  sequelizeInstance: any
  KEYCLOAK_SERVER: string | undefined
  KEYCLOAK_REALM: string | undefined
  KEYCLOAK_USER_CLIENT_ID: string | undefined
  KEYCLOAK_USER_CLIENT_SECRET: string | undefined
  getUserByEmail: GetUserByEmail
  createUser: CreateUser
}

export const makeKeycloakAuth = (deps: KeycloakAuthDeps) => {
  const {
    sequelizeInstance,
    KEYCLOAK_SERVER,
    KEYCLOAK_REALM,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_SECRET,
    getUserByEmail,
    createUser,
  } = deps

  if (
    !KEYCLOAK_SERVER ||
    !KEYCLOAK_REALM ||
    !KEYCLOAK_USER_CLIENT_ID ||
    !KEYCLOAK_USER_CLIENT_SECRET
  ) {
    console.error('Missing KEYCLOAK env vars')
    process.exit(1)
  }

  const SequelizeStore = makeSequelizeStore(session.Store)

  const store = new SequelizeStore({
    db: sequelizeInstance,
    tableName: 'sessions',
    checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
    expiration: 24 * 60 * 60 * 1000, // 1 day
  })

  const keycloak = new Keycloak(
    {
      store,
    },
    {
      'confidential-port': 0,
      'auth-server-url': KEYCLOAK_SERVER,
      resource: KEYCLOAK_USER_CLIENT_ID,
      'ssl-required': 'external',
      'bearer-only': false,
      realm: KEYCLOAK_REALM,
      // @ts-ignore
      credentials: {
        secret: KEYCLOAK_USER_CLIENT_SECRET,
      },
    }
  )

  const ensureRole: EnsureRole = (roles) => {
    const roleList = Array.isArray(roles) ? roles : [roles]

    return keycloak.protect((token) => {
      return roleList.some((role) => token.hasRealmRole(role))
    })
  }

  const registerAuth: RegisterAuth = ({ app, sessionSecret, router }) => {
    app.use(
      session({
        secret: sessionSecret,
        store,
        resave: false,
        proxy: true,
        saveUninitialized: false,
        ...(!isDevEnv && {
          cookie: {
            secure: true,
            httpOnly: true,
          },
        }),
      })
    )

    app.use(keycloak.middleware())

    app.use(
      makeAttachUserToRequestMiddleware({
        getUserByEmail,
        createUser,
      })
    )

    router.get(routes.LOGIN, keycloak.protect(), (req, res) => {
      res.redirect(routes.REDIRECT_BASED_ON_ROLE)
    })

    router.get(routes.REDIRECT_BASED_ON_ROLE, keycloak.protect(), async (req, res) => {
      const user = req.user as User

      if (!user) {
        // Sometimes, the user session is not immediately available in the req object
        // In that case, wait a bit and redirect to the same url

        // @ts-ignore
        if (req.kauth && Object.keys(req.kauth).length) {
          // This user has a session but no user was found, log him out
          // res.send('Found kauth but not req.user')
          logger.error(
            `Found user keycloak auth but not user in database for id ${req.kauth?.grant?.access_token?.content?.sub}`
          )
          res.redirect('/logout')
          return
        }

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

      miseAJourStatistiquesUtilisation({
        type: 'connexionUtilisateur',
        données: {
          utilisateur: {
            role: req.user.role,
          },
        },
      })

      // @ts-ignore
      const queryString = QueryString.stringify(req.query)

      res.redirect(routes.LISTE_PROJETS + '?' + queryString)
    })
  }

  return {
    registerAuth,
    ensureRole,
  }
}
