export interface Fixture<T> {
  readonly aÉtéCréé: boolean;
  créer(partialData?: Partial<Readonly<T>>): Readonly<T>;
}

export abstract class AbstractFixture<T> implements Fixture<T> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  protected set aÉtéCréé(value: boolean) {
    this.#aÉtéCréé = value;
  }

  abstract créer(partialData?: Partial<Readonly<T>> | undefined): Readonly<T>;
}
