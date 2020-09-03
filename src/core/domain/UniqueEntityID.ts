import { v4 as uuid } from 'uuid'

export class UniqueEntityID {
  private value: string

  constructor(value?: string) {
    this.value = value || uuid()
  }

  equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false
    }
    if (!(id instanceof this.constructor)) {
      return false
    }
    return id.value === this.value
  }

  toString(): string {
    return this.value
  }
}
