import { UniqueEntityID } from '@core/domain'

const format = (gestionnaire: string) =>
  new UniqueEntityID(`import-gestionnaire-réseau#${gestionnaire}`)

export default { format }
