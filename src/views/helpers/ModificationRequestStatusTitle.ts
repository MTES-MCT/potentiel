import { ModificationRequestStatus } from '../../modules/modificationRequest'

export const ModificationRequestStatusTitle: Record<ModificationRequestStatus, string> = {
  envoyée: 'Envoyée',
  'en instruction': 'En instruction',
  acceptée: 'Acceptée',
  rejetée: 'Rejetée',
  'en appel': 'En appel',
  'en appel en instruction': 'Appel en instruction',
  'en appel acceptée': 'Accepté en appel',
  'en appel rejetée': 'Appel rejeté',
  annulée: 'Annulée',
}
