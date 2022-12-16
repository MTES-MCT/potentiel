export class InvitationUtilisateurExistantError extends Error {
  constructor(public utilisateur: { email: string; role: string }) {
    super(`Impossible d'inviter un utilisateur existant`)
  }
}
