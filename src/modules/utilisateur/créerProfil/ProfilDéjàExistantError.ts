export class ProfilDéjàExistantError extends Error {
  constructor(public utilisateur: { email: string; role: string }) {
    super(`Impossible de créer 2 fois le même profil utilisateur`)
  }
}
