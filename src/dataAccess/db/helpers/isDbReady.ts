export default function isDbReady({ sequelizeInstance }) {
  return sequelizeInstance.authenticate()
}
