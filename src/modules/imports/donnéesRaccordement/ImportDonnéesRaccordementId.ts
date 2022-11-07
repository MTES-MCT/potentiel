import { UniqueEntityID } from '@core/domain'

const format = (gestionnaire: string) =>
  new UniqueEntityID(`import-données-raccordement#${gestionnaire}`)

export default { format }
