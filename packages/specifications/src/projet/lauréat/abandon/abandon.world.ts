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
}
