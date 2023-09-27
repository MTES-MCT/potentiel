export class AbandonWord {
  #piéceJustificative!: { format: string; content: string };

  get piéceJustificative(): { format: string; content: string } {
    if (!this.#piéceJustificative) {
      throw new Error('piéceJustificative not initialized');
    }
    return this.#piéceJustificative;
  }

  set piéceJustificative(value: { format: string; content: string }) {
    this.#piéceJustificative = value;
  }

  #dateAbandon!: Date;

  get dateAbandon(): Date {
    if (!this.#dateAbandon) {
      throw new Error('dateAbandon not initialized');
    }
    return this.#dateAbandon;
  }

  set dateAbandon(value: Date) {
    this.#dateAbandon = value;
  }

  #recandidature!: boolean;

  get recandidature(): boolean {
    if (!this.#recandidature) {
      throw new Error('recandidature not initialized');
    }
    return this.#recandidature;
  }

  set recandidature(value: boolean) {
    this.#recandidature = value;
  }
}
