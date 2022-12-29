export class InvitationUtilisateurNonAutoriséeError extends Error {
  constructor(public utilisateur: { email: string; role: string }) {
    super(`Autorisation refusée pour envoyer cette invitation`)
  }
}
