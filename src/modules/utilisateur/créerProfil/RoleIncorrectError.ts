export class RoleIncorrectError extends Error {
  constructor(public utilisateur: { email: string; role: string }) {
    super(`Le rôle ne correspond pas à celui de l'invitation`)
  }
}
