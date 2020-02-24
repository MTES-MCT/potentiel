import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:'
})

const checkIsDbReady = () => {
  return sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
      return sequelize.sync({ force: true })
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })
    .then(() => {
      console.log('Database models are sync')
    })
    .catch(err => {
      console.error('Unable to sync database models')
    })
}

export default sequelize
export { sequelize, checkIsDbReady }
