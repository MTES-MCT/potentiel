import makeCredentialsModel from './credentials.model'
import makeUserModel from './user.model'

export default function loadModels({ sequelize }) {
  return {
    credentialsDb: makeCredentialsModel({ sequelize }),
    userDb: makeUserModel({ sequelize })
  }
}
