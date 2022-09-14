type CahierDesChargesModifié = {
  paruLe: '30/07/2021' | '30/08/2022'
  modifié: true
  alternatif?: true
}

type CahierDesChargesInitialCRE4 = {
  paruLe: 'avant le 30/07/2021'
  periodeInitiale: number
  référence: string
  initial: true
}

type CahierDesChargesInitial = {
  paruLe?: undefined
  référence: string
  initial: true
}

type CahierDesCharges = {
  url: string
} & (CahierDesChargesModifié | CahierDesChargesInitial | CahierDesChargesInitialCRE4)

export type CahiersDesChargesDisponibles = readonly [CahierDesCharges, ...CahierDesCharges[]]
