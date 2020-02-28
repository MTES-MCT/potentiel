export default function isDbReady({ sequelize }) {
  return sequelize.authenticate()
}
