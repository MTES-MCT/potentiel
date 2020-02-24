import * as passport from 'passport'
import { Strategy } from 'passport-local'
import { ensureLoggedIn } from 'connect-ensure-login'
import { Application } from 'express'

import '../dataAccess'

//
// Configure Passport authenticated session persistence
//
passport.serializeUser(function(user, done) {
  done(null, user.id)
})

const dummyUser = { name: 'Pierre-Antoine', id: 1 }

passport.deserializeUser(function(id, done) {
  // TODO get the user by id
  done(null, dummyUser)
})

export default function({
  app,
  loginRoute,
  successRoute
}: {
  app: Application
  loginRoute: string
  successRoute: string
}) {
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
        // TODO: query a real database
        if (username == 'pad@dabla.com' && password == 'test') {
          return done(null, dummyUser)
        } else {
          return done(null, false)
        }
      }
    )
  )

  const authenticationHandler = passport.authenticate('local', {
    successReturnToOrRedirect: successRoute,
    failureRedirect: loginRoute + '?error=1'
  })

  return {
    authenticationHandler,
    ensureLoggedIn: () => ensureLoggedIn(loginRoute)
  }
}
