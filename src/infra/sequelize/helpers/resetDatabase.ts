import { sequelizeInstance } from '../../../sequelize.config'

export const resetDatabase = async () => {
  const { models } = sequelizeInstance
  return await Promise.all(
    Object.keys(models).map((key: string) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null
      return models[key].destroy({ where: {}, force: true })
    })
  )
}
