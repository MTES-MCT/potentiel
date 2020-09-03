import { UniqueEntityID } from './UniqueEntityID'

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID
  protected readonly props: T

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID()
    this.props = props
  }

  private static isEntity<K>(v: unknown): v is Entity<K> {
    return v instanceof Entity
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!Entity.isEntity(object)) {
      return false
    }

    return this._id.equals(object._id)
  }
}
