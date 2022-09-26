export type CahierDesCharges = {
  reference: string
  url: string
}

export type CahierDesChargesModifié = {
  url: string
  paruLe: DateParutionCahierDesChargesModifié
  alternatif?: true
  numéroGestionnaireRequis?: true
}

export const cahierDesChargesModifiéIds = [
  '30/07/2021',
  '30/08/2022',
  '30/08/2022-alternatif',
] as const
export type CahierDesChargesModifiéId = typeof cahierDesChargesModifiéIds[number]

export const cahierDesChargesIds = ['initial', ...cahierDesChargesModifiéIds] as const
export type CahierDesChargesId = typeof cahierDesChargesIds[number]

const datesParutionCahierDesChargesModifié = ['30/07/2021', '30/08/2022'] as const
const datesParutionCahierDesCharges = ['initial', ...datesParutionCahierDesChargesModifié] as const

export type DateParutionCahierDesCharges = typeof datesParutionCahierDesCharges[number]

export type DateParutionCahierDesChargesModifié =
  typeof datesParutionCahierDesChargesModifié[number]

export type CahierDesChargesIdParsed = {
  paruLe: DateParutionCahierDesCharges
  alternatif?: true
}

export type CahierDesChargesModifiéIdParsed = {
  paruLe: DateParutionCahierDesChargesModifié
  alternatif?: true
}

export const parseCahierDesChargesId = <C extends CahierDesChargesId | CahierDesChargesModifiéId>(
  id: C
): C extends CahierDesChargesModifiéId
  ? CahierDesChargesModifiéIdParsed
  : CahierDesChargesIdParsed => ({
  paruLe: id.replace('-alternatif', '') as DateParutionCahierDesChargesModifié,
  alternatif: id.search('-alternatif') === -1 ? undefined : true,
})

export const formatCahierDesChargesId = ({
  paruLe,
  alternatif,
}: CahierDesChargesIdParsed): CahierDesChargesId =>
  `${paruLe}${alternatif ? '-alternatif' : ''}` as CahierDesChargesId
