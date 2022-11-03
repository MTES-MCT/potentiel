import { DonnéesCourriersRéponse } from './donnéesCourriersRéponse'

export type CahierDesCharges = {
  référence: string
  url: string
}

export type DélaiApplicable = {
  délaiEnMois: number
  intervaleDateMiseEnService: { min: Date; max: Date }
}

export type CahierDesChargesModifié = {
  type: 'modifié'
  url: string
  paruLe: DateParutionCahierDesChargesModifié
  alternatif?: true
  numéroGestionnaireRequis?: true
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponse>
  délaiApplicable?: DélaiApplicable
}

export const cahiersDesChargesRéférences = [
  'initial',
  '30/07/2021',
  '30/08/2022',
  '30/08/2022-alternatif',
] as const

export type CahierDesChargesRéférence = typeof cahiersDesChargesRéférences[number]

const datesParutionCahiersDesChargesModifiés = ['30/07/2021', '30/08/2022'] as const

export type DateParutionCahierDesChargesModifié =
  typeof datesParutionCahiersDesChargesModifiés[number]

export type CahierDesChargesRéférenceParsed =
  | { type: 'initial' }
  | { type: 'modifié'; paruLe: DateParutionCahierDesChargesModifié; alternatif?: true }

export const parseCahierDesChargesRéférence = (
  référence: CahierDesChargesRéférence
): CahierDesChargesRéférenceParsed => {
  if (référence === 'initial') {
    return { type: 'initial' }
  }

  return {
    type: 'modifié',
    paruLe: référence.replace('-alternatif', '') as DateParutionCahierDesChargesModifié,
    alternatif: référence.search('-alternatif') === -1 ? undefined : true,
  }
}

export const formatCahierDesChargesRéférence = (
  cdc: CahierDesChargesRéférenceParsed
): CahierDesChargesRéférence =>
  cdc.type === 'initial'
    ? 'initial'
    : (`${cdc.paruLe}${cdc.alternatif ? '-alternatif' : ''}` as CahierDesChargesRéférence)
