export type GarantiesFinancièresFamille =
  | {
      soumisAuxGarantiesFinancieres: 'après candidature'
      garantieFinanciereEnMois: number
    }
  | {
      soumisAuxGarantiesFinancieres: 'à la candidature' | 'non soumis'
    }

export type Famille = {
  id: string
  title: string
} & GarantiesFinancièresFamille
