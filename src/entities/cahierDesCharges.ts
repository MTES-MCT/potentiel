export type CahierDesCharges = {
  référence: string
  url: string
}

export type CahierDesChargesModifié = {
  url: string
  paruLe: DateParutionCahierDesChargesModifié
  alternatif?: true
  numéroGestionnaireRequis?: true
  changementDePuissance?: { référenceParagraphe: string; dispositions: string }
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

export type CahierDesChargesRéférenceParsed = {
  paruLe: DateParutionCahierDesCharges
  alternatif?: true
}

export type CahierDesChargesModifiéRéférenceParsed = {
  paruLe: DateParutionCahierDesChargesModifié
  alternatif?: true
}

export const parseCahierDesChargesRéférence = <
  C extends CahierDesChargesRéférence | CahierDesChargesModifiéRéférence
>(
  référence: C
) =>
  ({
    paruLe: référence.replace('-alternatif', ''),
    alternatif: référence.search('-alternatif') === -1 ? undefined : true,
  } as C extends CahierDesChargesModifiéRéférence
    ? CahierDesChargesModifiéRéférenceParsed
    : CahierDesChargesRéférenceParsed)

export const formatCahierDesChargesRéférence = ({
  paruLe,
  alternatif,
}: CahierDesChargesRéférenceParsed): CahierDesChargesRéférence =>
  `${paruLe}${alternatif ? '-alternatif' : ''}` as CahierDesChargesRéférence
