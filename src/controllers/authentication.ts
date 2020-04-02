import passport from 'passport'
import { Strategy } from 'passport-local'
import { ensureLoggedIn as _ensureLoggedIn } from 'connect-ensure-login'
import { Application, Request, Response, NextFunction } from 'express'

import { User } from '../entities'
import { login } from '../useCases'
import { UserRepo, userRepo } from '../dataAccess'

interface RegisterAuthProps {
  app: Application
  loginRoute: string
  successRoute: string
}

let isAuthRegistered = false
let _loginRoute: RegisterAuthProps['loginRoute']
let _successRoute: RegisterAuthProps['successRoute']

// Method to be called first
// Sets up passport middleware in the express app
const registerAuth = ({ app, loginRoute, successRoute }: RegisterAuthProps) => {
  if (isAuthRegistered) {
    throw new Error('Authentication can only be registered once')
  }

  isAuthRegistered = true
  _loginRoute = loginRoute
  _successRoute = successRoute

  //
  // Configure Passport authenticated session persistence
  //
  passport.serializeUser(function (user: User, done) {
    done(null, user.id)
  })

  passport.deserializeUser(async function (id: User['id'], done) {
    const userResult = await userRepo.findById(id)

    if (userResult.is_none()) {
      console.log('Authentication: Found user session id but no matching user')
      done(null, null)
    }

    done(null, userResult.unwrap())
  })

  //
  // Initialize authentication state from session, if any
  //
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      function (username: string, password: string, done) {
        // console.log('Call to login with', username)
        login({ email: username, password })
          .then((userResult) => {
            // console.log(
            //   'login has returned, setting currentUser to ',
            //   userResult
            // )

            if (userResult.is_err()) {
              console.log('Login failed', userResult.unwrap_err())
              return done(null, false)
            }

            return done(null, userResult.unwrap())
          })
          .catch((err) => {
            // Should never happen because login shouldn't throw
            console.log('login caught an error', err)
            return done(err)
          })
      }
    )
  )
}

// Handler for the login route
const postLogin = () => {
  if (!isAuthRegistered) {
    throw new Error('Cannot use postLogin before calling registerAuth')
  }

  return passport.authenticate('local', {
    successReturnToOrRedirect: _successRoute,
    failureRedirect: _loginRoute + '?error=1',
  })
}

const logoutMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.logout()

  next()
}

const ensureLoggedIn = () => _ensureLoggedIn(_loginRoute)

export {
  registerAuth,
  postLogin,
  logoutMiddleware,
  // Handler for all auth enabled routes
  ensureLoggedIn,
}
