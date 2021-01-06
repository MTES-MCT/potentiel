import { ModificationRequestStatus } from '../../modules/modificationRequest'

export const ModificationRequestColorByStatus: Record<
  ModificationRequestStatus | 'en instruction',
  'error' | 'success' | 'warning' | ''
> = {
  envoyée: '',
  'en instruction': 'warning',
  acceptée: 'success',
  rejetée: 'error',
  annulée: '',
}
