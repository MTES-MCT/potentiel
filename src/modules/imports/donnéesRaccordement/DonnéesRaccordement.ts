export type DonnéesRaccordement = { identifiantGestionnaireRéseau: string } & (
  | { dateMiseEnService: Date; dateFileAttente: Date }
  | { dateMiseEnService: Date }
  | { dateFileAttente: Date }
)

export type DonnéesRaccordementFormatDatesISOString = { identifiantGestionnaireRéseau: string } & (
  | { dateMiseEnService: string; dateFileAttente: string }
  | { dateMiseEnService: string }
  | { dateFileAttente: string }
)
