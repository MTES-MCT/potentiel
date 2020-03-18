import passport from 'passport'
import { Strategy } from 'passport-local'
import { ensureLoggedIn as _ensureLoggedIn } from 'connect-ensure-login'
import { Application, Request, Response, NextFunction } from 'express'

import { User } from '../entities'
import { login } from '../useCases'
import { UserRepo, userRepo } from '../dataAccess'

interface MakeAuthenticationProps {
  userRepo: UserRepo
}

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
  passport.serializeUser(function(user: User, done) {
    done(null, user.id)
  })

  passport.deserializeUser(async function(id: User['id'], done) {
    const user = await userRepo.findById(id)
    done(null, user)
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
        passwordField: 'password'
      },
      function(username: string, password: string, done) {
        login({ email: username, password })
          .then(user => {
            // console.log('login has returned, setting currentUser to ', user)
            return done(null, user)
          })
          .catch(err => {
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
    failureRedirect: _loginRoute + '?error=1'
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
  ensureLoggedIn
}
