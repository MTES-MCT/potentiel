import { ModificationRequestStatus } from '../../modules/modificationRequest'

export const ModificationRequestColorByStatus: Record<
  ModificationRequestStatus,
  'error' | 'success' | 'warning' | ''
> = {
  envoyée: '',
  'en instruction': 'warning',
  acceptée: 'success',
  rejetée: 'error',
  'en appel': 'warning',
  'en appel en instruction': 'warning',
  'en appel acceptée': 'success',
  'en appel rejetée': 'error',
  annulée: '',
}
