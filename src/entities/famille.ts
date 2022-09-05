export type GarantiesFinancièresFamille =
  | {
      soumisAuxGarantiesFinancieres: true
      garantiesFinancieresDeposeesALaCandidature: false
      garantieFinanciereEnMois: number
    }
  | {
      soumisAuxGarantiesFinancieres: true
      garantiesFinancieresDeposeesALaCandidature: true
      garantieFinanciereEnMois?: undefined
    }
  | {
      soumisAuxGarantiesFinancieres: false
      garantiesFinancieresDeposeesALaCandidature?: undefined
      garantieFinanciereEnMois?: undefined
    }

export type Famille = {
  id: string
  title: string
} & GarantiesFinancièresFamille
