import { TexteCDCCourriers } from './appelOffre'

export type CahierDesCharges = {
  reference: string
  url: string
}

export type DateParutionCahierDesChargesModifié = '30/07/2021' | '30/08/2022'

export type CahierDesChargesModifié = {
  paruLe: DateParutionCahierDesChargesModifié
  url: string
  alternatif?: true
  texteCDCCourriers?: TexteCDCCourriers
}

type CahierDesChargesActuel = {
  paruLe: string
  alternatif?: true
}

export const parseCahierDesChargesActuel = (id: string): CahierDesChargesActuel => ({
  paruLe: id.replace('-alternatif', ''),
  alternatif: id.search('-alternatif') === -1 ? undefined : true,
})

export const formatCahierDesChargesActuel = ({
  paruLe,
  alternatif,
}: CahierDesChargesActuel): string => `${paruLe}${alternatif ? '-alternatif' : ''}`
