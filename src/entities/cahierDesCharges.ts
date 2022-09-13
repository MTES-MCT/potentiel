type DatesDePublicationCDC = 'avant le 30/07/2021' | '30/07/2021' | '30/08/2022'

type CahierDesCharges = {
  référence: string
  url: string
} & (
  | {
      paruLe: Exclude<DatesDePublicationCDC, 'avant le 30/07/2021'>
      alternatif?: true
    }
  | {
      paruLe: Extract<DatesDePublicationCDC, 'avant le 30/07/2021'>
      periodeInitiale: number
    }
)

export type CahiersDesChargesDisponibles = readonly [CahierDesCharges, ...CahierDesCharges[]]
