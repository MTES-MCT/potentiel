import makeCredentialsModel from './credentials.model'

export default function loadModels({ sequelize }) {
  return {
    credentialsDb: makeCredentialsModel({ sequelize })
  }
}
