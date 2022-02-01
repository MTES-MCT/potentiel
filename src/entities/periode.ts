import { Territoire } from './territoire'

type NoteThreshold = {
  familleId: string
  noteThreshold: number
  territoire?: Territoire
}

export type CertificateTemplate = 'v0' | 'v1' | 'ppe2.v0'

export type Periode = {
  id: string
  title: string
  noteThresholdByFamily?: NoteThreshold[]
  paragrapheAchevement: string
} & (
  | {
      isNotifiedOnPotentiel: true
      certificateTemplate: CertificateTemplate
    }
  | { isNotifiedOnPotentiel?: false }
)
