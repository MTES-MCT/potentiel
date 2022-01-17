import { ModificationRequestCancelled } from '@modules/modificationRequest'
import { modificationRequestProjector } from '../modificationRequest.model'

export const onModificationRequestCancelled = modificationRequestProjector
  .on(ModificationRequestCancelled)
  .update({
    where: ({ payload: { modificationRequestId } }) => ({ id: modificationRequestId }),
    delta: ({ payload: { cancelledBy }, occurredAt }) => ({
      status: 'annulée',
      cancelledBy,
      cancelledOn: occurredAt.getTime(),
    }),
  })
