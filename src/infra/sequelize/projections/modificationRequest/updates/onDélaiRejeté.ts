import { DélaiRejeté } from '@modules/demandeModification'
import { modificationRequestProjector } from '../modificationRequest.model'

export const onDélaiRejeté = modificationRequestProjector.on(DélaiRejeté).update({
  where: ({ payload: { demandeDélaiId } }) => ({ id: demandeDélaiId }),
  delta: ({ payload: { rejetéPar }, occurredAt }) => ({
    status: 'rejetée',
    respondedBy: rejetéPar,
    respondedOn: occurredAt.getTime(),
  }),
})
