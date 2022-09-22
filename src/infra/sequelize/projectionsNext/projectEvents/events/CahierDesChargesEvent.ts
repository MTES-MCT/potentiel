import { NouveauCahierDesChargesChoisiPayload } from '@modules/project'
import { ProjectEvent } from '..'

export type CahierDesChargesEvent = ProjectEvent & {
  type: 'NouveauCahierDesChargesChoisi'
  payload: {
    choisiPar: string
    paruLe: NouveauCahierDesChargesChoisiPayload['paruLe']
    alternatif?: true
  }
}
