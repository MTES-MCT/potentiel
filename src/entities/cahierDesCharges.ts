import { DonnéesCourriersRéponse } from './donnéesCourriersRéponse'

export type CahierDesCharges = {
  référence: string
  url: string
}

export type CahierDesChargesModifié = {
  url: string
  paruLe: DateParutionCahierDesChargesModifié
  alternatif?: true
  numéroGestionnaireRequis?: true
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponse>
}

export const cahiersDesChargesModifiésRéférences = [
  '30/07/2021',
  '30/08/2022',
  '30/08/2022-alternatif',
] as const

export const cahiersDesChargesRéférences = [
  'initial',
  ...cahiersDesChargesModifiésRéférences,
] as const

export type CahierDesChargesModifiéRéférence = typeof cahiersDesChargesModifiésRéférences[number]
export type CahierDesChargesRéférence = typeof cahiersDesChargesRéférences[number]

const datesParutionCahiersDesChargesModifiés = ['30/07/2021', '30/08/2022'] as const
const datesParutionCahiersDesCharges = [
  'initial',
  ...datesParutionCahiersDesChargesModifiés,
] as const

export type DateParutionCahierDesCharges = typeof datesParutionCahiersDesCharges[number]
export type DateParutionCahierDesChargesModifié =
  typeof datesParutionCahiersDesChargesModifiés[number]

export type CahierDesChargesRéférenceParsed =
  | { type: 'initial' }
  | { type: 'modifié'; paruLe: DateParutionCahierDesChargesModifié; alternatif?: true }

export type CahierDesChargesModifiéRéférenceParsed = {
  paruLe: DateParutionCahierDesChargesModifié
  alternatif?: true
}

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

export const formatCahierDesChargesRéférence = ({
  paruLe,
  alternatif,
}: CahierDesChargesModifiéRéférenceParsed): CahierDesChargesModifiéRéférence =>
  `${paruLe}${alternatif ? '-alternatif' : ''}` as CahierDesChargesModifiéRéférence
