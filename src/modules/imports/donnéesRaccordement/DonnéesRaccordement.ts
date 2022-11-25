export type DonnéesRaccordement = { identifiantGestionnaireRéseau: string } & (
  | { dateMiseEnService: Date; dateFileAttente: Date }
  | { dateMiseEnService: Date }
  | { dateFileAttente: Date }
)
