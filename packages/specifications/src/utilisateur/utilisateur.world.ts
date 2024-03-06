export class UtilisateurWorld {
  #porteur!: string;

  get porteur(): string {
    if (!this.#porteur) {
      throw new Error('porteur not initialized');
    }
    return this.#porteur;
  }

  set porteur(value: string) {
    this.#porteur = value;
  }
}
