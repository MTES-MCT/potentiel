export class InvitationUniqueParUtilisateurError extends Error {
  constructor(public utilisateur: { email: string; role: string }) {
    super(`Impossible d'inviter 2 fois le même utilisateur`)
  }
}
