import { sequelize } from '../../../sequelize.config'

import MakeFileModel from './file'
import MakeNotificationModel from './notification'

const models = {
  File: MakeFileModel(sequelize),
  Notification: MakeNotificationModel(sequelize),
}

// Create associations
Object.values(models).forEach((model) => model.associate(models))

export default models
