export type CahierDesCharges = {
  reference: string
  url: string
}

export type DateParutionCahierDesChargesModifié = '30/07/2021' | '30/08/2022'

export type CahierDesChargesModifié = {
  paruLe: DateParutionCahierDesChargesModifié
  url: string
  alternatif?: true
}
