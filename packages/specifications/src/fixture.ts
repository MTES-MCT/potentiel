export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface Fixture<T> {
  readonly aÉtéCréé: boolean;
  // créer(partialData?: DeepPartial<Readonly<T>>): Readonly<T>;
}

export abstract class AbstractFixture<T> implements Fixture<T> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  protected set aÉtéCréé(value: boolean) {
    this.#aÉtéCréé = value;
  }

  // abstract créer(partialData?: DeepPartial<Readonly<T>> | undefined): Readonly<T>;
}
