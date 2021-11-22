import { BuildProjectIdentifier } from '../../modules/project/queries/BuildProjectIdentifier'
import { createHmac } from 'crypto'

export const makeBuildProjectIdentifier: (string) => BuildProjectIdentifier = (
  potentielIdentifierSecret
) => {
  return ({ appelOffreId, periodeId, familleId, numeroCRE }) => {
    const hmac = createHmac('sha256', potentielIdentifierSecret)
    hmac.update(appelOffreId + periodeId + familleId + numeroCRE)

    return `${appelOffreId}-P${periodeId}${
      familleId ? `-F${familleId}` : ''
    }-${numeroCRE}-${hmac.digest('hex').substring(0, 3)}`
  }
}
