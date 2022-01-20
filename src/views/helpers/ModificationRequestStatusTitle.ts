import { ModificationRequestStatusDTO } from '@modules/modificationRequest'

export const ModificationRequestStatusTitle: Record<ModificationRequestStatusDTO, string> = {
  envoyée: 'Envoyée',
  'information validée': 'Information validée',
  'en instruction': 'En instruction',
  'en attente de confirmation': 'En attente de confirmation',
  'demande confirmée': 'Demande confirmée',
  acceptée: 'Acceptée',
  rejetée: 'Rejetée',
  annulée: 'Annulée',
}
