import { ModificationRequestStatusDTO } from '../../modules/modificationRequest'

export const ModificationRequestStatusTitle: Record<ModificationRequestStatusDTO, string> = {
  envoyée: 'Envoyée',
  'en instruction': 'En instruction',
  acceptée: 'Acceptée',
  rejetée: 'Rejetée',
  annulée: 'Annulée',
}
