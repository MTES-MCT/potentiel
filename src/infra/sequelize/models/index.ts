import { sequelize } from '../../../sequelize.config'

import MakeFileModel from './file'

const models = {
  File: MakeFileModel(sequelize),
}

// Create associations
Object.values(models).forEach((model) => model.associate(models))

export default models
