import { makeServer } from './server'

// Check env variables

const mandatoryVariables = ['NODE_ENV', 'BASE_URL', 'SEND_EMAILS_FROM']

mandatoryVariables.forEach((variable) => {
  if (!process.env[variable]) {
    console.error(`Missing ${variable} environment variable`)
    process.exit(1)
  }
})

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  console.error('Missing SESSION_SECRET environment variable')
  process.exit(1)
}

const port: number = Number(process.env.PORT) || 3000
makeServer(port, sessionSecret)
