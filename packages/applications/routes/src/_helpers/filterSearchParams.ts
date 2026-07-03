/**
 * FiltersSearchParams is similar to URLSearchParams but encodes arrays as a single, comma separated, string
 * @exemple `foo=bar,baz&bar=qux` instead of `foo=bar&foo=baz&bar=qux`
 */
export class FiltersSearchParams extends URLSearchParams {
  static readonly separator = '|';
  getAll(name: string): string[] {
    const values = super.get(name)?.split(FiltersSearchParams.separator) ?? [];
    if (values.length === 0) {
      return [];
    }
    return values.flatMap((value) => value.split(FiltersSearchParams.separator));
  }

  deleteOne(key: string, value: string): void {
    const current = this.getAll(key);
    if (current.length === 0) {
      return;
    }
    const newValues = current.filter((v) => v !== value);
    if (newValues.length === 0) {
      super.delete(key);
    } else {
      this.set(key, newValues.join(FiltersSearchParams.separator));
    }
  }

  toString(): string {
    const uniqueParams = new URLSearchParams();
    for (const [key, value] of this.entries()) {
      if (uniqueParams.has(key)) {
        const existingValue = uniqueParams.get(key);
        uniqueParams.set(key, [existingValue, value].join(FiltersSearchParams.separator));
      } else {
        uniqueParams.set(key, value);
      }
    }
    return uniqueParams.toString();
  }
}
