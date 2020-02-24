import * as passport from 'passport'
import { Strategy } from 'passport-local'
import { ensureLoggedIn } from 'connect-ensure-login'
import { Application } from 'express'

export default function({ login }) {
  let isAuthRegistered = false
  let _loginRoute
  let _successRoute

  // Method to be called first
  // Sets up passport middleware in the express app
  const registerAuth = ({
    app,
    loginRoute,
    successRoute
  }: {
    app: Application
    loginRoute: string
    successRoute: string
  }) => {
    if (isAuthRegistered) {
      throw new Error('Authentication can only be registered once')
    }

    isAuthRegistered = true
    _loginRoute = loginRoute
    _successRoute = successRoute

    //
    // Configure Passport authenticated session persistence
    //
    passport.serializeUser(function(user, done) {
      done(null, user)
    })

    passport.deserializeUser(function(id, done) {
      // TODO get the user by id
      done(null, { userId: id })
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
        function(username, password, done) {
          login({ email: username, password })
            .then(userId => {
              return done(null, userId)
            })
            .catch(err => {
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

  return {
    registerAuth,
    postLogin,
    // Handler for all auth enabled routes
    ensureLoggedIn: () => ensureLoggedIn(_loginRoute)
  }
}
