export type PeriodeDTO = {
  appelOffreId: string
  periodeId: string

  // Used in getModificationRequestDataForResponseTemplate
  'Référence du paragraphe dédié à l’engagement de réalisation ou aux modalités d’abandon': string
  'Dispositions liées à l’engagement de réalisation ou aux modalités d’abandon': string
  "Lien de l'ancien cahier des charges"?: string
  'Lien du nouveau cahier des charges'?: string
}
