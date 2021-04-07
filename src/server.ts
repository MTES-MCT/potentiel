import makeSequelizeStore from 'connect-session-sequelize'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import { version } from '../package.json'
import { registerAuth, v1Router } from './controllers'
import { logger } from './core/utils'
import { initDatabase } from './dataAccess'
import routes from './routes'
import { sequelizeInstance } from './sequelize.config'
import { testRouter } from './__tests__/integration'
import { isDevEnv } from './config'

dotenv.config()

const SequelizeStore = makeSequelizeStore(session.Store)

const FILE_SIZE_LIMIT_MB = 50

export async function makeServer(port: number, sessionSecret: string) {
  try {
    const app = express()

    if (!isDevEnv) {
      app.use(
        helmet({
          //   // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
          //   // Only send refererer for same origin and transport (HTTPS->HTTPS)
          referrerPolicy: { policy: 'strict-origin' },
        })
      )
    }

    const store = new SequelizeStore({
      db: sequelizeInstance,
      tableName: 'sessions',
      checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
      expiration: 24 * 60 * 60 * 1000, // 1 day
    })

    app.use(
      express.urlencoded({
        extended: false,
        limit: FILE_SIZE_LIMIT_MB + 'mb',
      })
    )
    app.use(express.json({ limit: FILE_SIZE_LIMIT_MB + 'mb' }))

    app.use(cookieParser())

    app.use(
      session({
        secret: sessionSecret,
        store,
        resave: false,
        proxy: true,
        saveUninitialized: false,
      })
    )

    registerAuth({
      app,
      loginRoute: routes.LOGIN,
      successRoute: routes.REDIRECT_BASED_ON_ROLE,
    })

    app.use(express.static('src/public'))
    app.use(v1Router)

    if (process.env.NODE_ENV === 'test') {
      app.use(testRouter)
    }

    app.use((error, req, res, next) => {
      logger.error(error)

      res
        .status(500)
        .send(
          'Une erreur inattendue est survenue. Veuillez nous excuser pour la gêne occasionée. Merci de réessayer et de contacter l‘équipe si le problème persiste.'
        )
    })

    // wait for the database to initialize
    await initDatabase()

    return new Promise((resolve) => {
      const server = app.listen(port, () => {
        logger.info(`Server listening on port ${port}!`)
        logger.info(`NODE_ENV is ${process.env.NODE_ENV}`)
        logger.info(`Version ${version}`)
        resolve(server)
      })
    })
  } catch (error) {
    logger.error(error)
  }
}

export * from './dataAccess'
