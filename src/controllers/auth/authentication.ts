import passport from 'passport'
import { Strategy } from 'passport-local'
import { ensureLoggedIn as _ensureLoggedIn } from 'connect-ensure-login'
import { Application, Request, Response, NextFunction } from 'express'

import { User } from '../../entities'
import { login } from '../../useCases'
import { userRepo } from '../../dataAccess'
import { logger } from '../../core/utils'
import routes from '../../routes'
import { v1Router } from '../v1Router'

interface RegisterAuthProps {
  app: Application
  loginRoute: string
  successRoute: string
}

// Method to be called first
// Sets up passport middleware in the express app
const registerAuth = ({ app }: RegisterAuthProps) => {
  //
  // Configure Passport authenticated session persistence
  //
  passport.serializeUser(function (user: User, done) {
    done(null, user.id)
  })

  passport.deserializeUser(async function (id: User['id'], done) {
    const userResult = await userRepo.findById(id)

    if (userResult.is_none()) {
      logger.error('Authentication: Found user session id but no matching user')
      return done(null, null)
    }

    done(null, userResult.unwrap())
  })

  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      function (username: string, password: string, done) {
        login({ email: username, password })
          .then((userResult) => {
            if (userResult.is_err()) {
              logger.info(userResult.unwrap_err().toString())
              return done(null, false)
            }

            return done(null, userResult.unwrap())
          })
          .catch((err) => {
            // Should never happen because login shouldn't throw
            logger.error(err)
            return done(err)
          })
      }
    )
  )

  //
  // Initialize authentication state from session, if any
  //
  app.use(passport.initialize())
  app.use(passport.session())

  v1Router.post(routes.LOGIN_ACTION, postLogin())
  v1Router.get(routes.LOGOUT_ACTION, logoutMiddleware, (req, res) => {
    res.redirect('/')
  })
  v1Router.get(routes.REDIRECT_BASED_ON_ROLE, ensureLoggedIn(), (req, res) => {
    const user = req.user as User

    if (user.role === 'admin' || user.role === 'dgec') {
      res.redirect(routes.ADMIN_DASHBOARD)
    }

    if (user.role === 'dreal') {
      res.redirect(routes.ADMIN_DASHBOARD)
    }

    if (user.role === 'porteur-projet') {
      res.redirect(routes.USER_DASHBOARD)
    }
  })
}

// Handler for the login route
const postLogin = () => {
  return passport.authenticate('local', {
    successReturnToOrRedirect: routes.REDIRECT_BASED_ON_ROLE,
    failureRedirect: `${routes.LOGIN}?error=Identifiant ou mot de passe erroné.`,
  })
}

const logoutMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.logout()

  next()
}

const ensureLoggedIn = () => _ensureLoggedIn(routes.LOGIN)

const ensureRole = (roles: string | Array<string>) => (req, res, next) => {
  const user = req.user as User

  if (!user) {
    return res.redirect(routes.LOGIN)
  }

  if (typeof roles === 'string') {
    if (user.role !== roles) {
      return res.redirect(routes.REDIRECT_BASED_ON_ROLE)
    }
  } else {
    if (!roles.includes(user.role)) {
      return res.redirect(routes.REDIRECT_BASED_ON_ROLE)
    }
  }

  // Ok to move forward
  next()
}

export {
  registerAuth,
  // Handler for all auth enabled routes
  ensureLoggedIn,
  ensureRole,
}
