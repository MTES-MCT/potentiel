import { ModificationRequestStatus } from '../../modules/modificationRequest'

export const ModificationRequestStatusTitle: Record<
  ModificationRequestStatus | 'en instruction',
  string
> = {
  envoyée: 'Envoyée',
  'en instruction': 'En instruction',
  acceptée: 'Acceptée',
  rejetée: 'Rejetée',
  annulée: 'Annulée',
}
