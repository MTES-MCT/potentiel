export interface BuildProjectIdentifier {
  (projectInfo: {
    appelOffreId: string
    periodeId: string
    familleId: string
    numeroCRE: string
  }): string
}
