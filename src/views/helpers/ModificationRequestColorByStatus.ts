import { ModificationRequestStatusDTO } from '@modules/modificationRequest';

export const ModificationRequestColorByStatus: Record<
  ModificationRequestStatusDTO,
  'error' | 'success' | 'warning' | ''
> = {
  envoyée: '',
  'information validée': 'success',
  'en instruction': 'warning',
  'en attente de confirmation': 'warning',
  'demande confirmée': 'warning',
  acceptée: 'success',
  rejetée: 'error',
  annulée: 'error',
};
