import { ModificationRequestStatusDTO } from '../../modules/modificationRequest'

export const ModificationRequestColorByStatus: Record<
  ModificationRequestStatusDTO,
  'error' | 'success' | 'warning' | ''
> = {
  envoyée: '',
  'en instruction': 'warning',
  acceptée: 'success',
  rejetée: 'error',
  annulée: '',
}
