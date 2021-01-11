export interface ModificationRequestInfoForStatusNotificationDTO {
  porteursProjet: { email: string; fullName: string; id: string }[]
  nomProjet: string
  type: string
}
