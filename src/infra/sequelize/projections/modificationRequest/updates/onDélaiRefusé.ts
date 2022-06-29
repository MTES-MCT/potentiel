import { DélaiRefusé } from '@modules/demandeModification'
import { modificationRequestProjector } from '../modificationRequest.model'

export const onDélaiRefusé = modificationRequestProjector.on(DélaiRefusé).update({
  where: ({ payload: { demandeDélaiId } }) => ({ id: demandeDélaiId }),
  delta: ({ payload: { refuséPar }, occurredAt }) => ({
    status: 'rejetée',
    respondedBy: refuséPar,
    respondedOn: occurredAt.getTime(),
  }),
})
