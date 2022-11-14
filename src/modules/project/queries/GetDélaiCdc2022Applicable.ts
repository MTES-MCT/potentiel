import { CahierDesChargesRéférenceParsed } from '@entities'

export type GetDélaiCDC2022Applicable = (args: {
  cahierDesChargesParsed: CahierDesChargesRéférenceParsed
  appelOffreId: string
  periodeId: string
  familleId: string
}) => number | undefined
