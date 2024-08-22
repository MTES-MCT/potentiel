export interface Fixture<T> {
  readonly aÉtéCréé: boolean;
  créer(partialData?: Partial<Readonly<T>>): Readonly<T>;
}
