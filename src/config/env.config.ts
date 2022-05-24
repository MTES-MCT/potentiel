import dotenv from 'dotenv'
dotenv.config()

console.info(`NODE_ENV = ${process.env.NODE_ENV}`)

if (
  !['local', 'test', 'development', 'staging', 'production'].includes(process.env.NODE_ENV || '')
) {
  console.error('ERROR: NODE_ENV not recognized')
  process.exit(1)
}

export const isTestEnv = process.env.NODE_ENV === 'test'
export const isDevEnv = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local'
export const isStagingEnv = process.env.NODE_ENV === 'staging'
export const isProdEnv = process.env.NODE_ENV === 'production'

export const dgecEmail: string = process.env.DGEC_EMAIL!

console.log(
  'Environment is ' +
    (isTestEnv
      ? 'Test'
      : isDevEnv
      ? 'Dev'
      : isStagingEnv
      ? 'Staging'
      : isProdEnv
      ? 'Production'
      : 'Not recognized')
)
