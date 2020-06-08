import { makeServer } from './server'

// Check env variables

const mandatoryVariables = ['NODE_ENV', 'BASE_URL', 'SEND_EMAILS_FROM']

mandatoryVariables.forEach((variable) => {
  if (!process.env[variable]) {
    console.log(`Missing ${variable} environment variable`)
    process.exit(1)
  }
})

makeServer()
