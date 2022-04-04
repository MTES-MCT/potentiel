import map from 'lodash/map'
import { sequelizeInstance } from '../../../sequelize.legacy.config'
export default async function truncateAllTables() {
  const { models } = sequelizeInstance
  return await Promise.all(
    map(Object.keys(models), (key: string) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null
      return models[key].destroy({ where: {}, force: true })
    })
  )
}
