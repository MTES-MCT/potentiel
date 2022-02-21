import { Territoire } from './territoire'

type NoteThresholdByFamily = {
  familleId: string
  noteThreshold: number
  territoire?: Territoire
}

type NoteThresholdByCategory = {
  volumeReserve: {
    noteThreshold: number
    puissanceMax: number
  }
  autres: {
    noteThreshold: number
  }
}

export type CertificateTemplate = 'cre4.v0' | 'cre4.v1' | 'ppe2.v1'

export type Periode = {
  id: string
  title: string
  paragrapheAchevement: string
} & (
  | ({
      isNotifiedOnPotentiel: true
      certificateTemplate: CertificateTemplate
    } & (
      | {
          noteThresholdBy: 'family'
          noteThreshold: NoteThresholdByFamily[]
        }
      | {
          noteThresholdBy: 'category'
          noteThreshold: NoteThresholdByCategory
        }
      | {
          noteThresholdBy?: undefined
          noteThreshold: number
        }
    ))
  | { isNotifiedOnPotentiel?: false }
)
