import { Static } from '../types/schemaTypes'
import { territoireSchema } from './project'

type NoteThreshold = {
  familleId: string
  noteThreshold: number
  territoire?: Static<typeof territoireSchema>
}

export type CertificateTemplate = 'v0'

export type Periode = {
  id: string
  title: string
  noteThresholdByFamily?: NoteThreshold[]
  isNotifiedOnPotentiel?: true
  certificateTemplate?: CertificateTemplate
}
