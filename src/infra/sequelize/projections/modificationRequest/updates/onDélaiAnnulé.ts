import { DélaiAnnulé } from '@modules/demandeModification'
import { modificationRequestProjector } from '../modificationRequest.model'

export const onDélaiAnnulé = modificationRequestProjector.on(DélaiAnnulé).update({
  where: ({ payload: { demandeDélaiId } }) => ({ id: demandeDélaiId }),
  delta: ({ payload: { annuléPar }, occurredAt }) => ({
    status: 'annulée',
    cancelledBy: annuléPar,
    cancelledOn: occurredAt.getTime(),
  }),
})
