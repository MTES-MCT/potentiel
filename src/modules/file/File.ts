import { Project, User } from '../../entities'
import { AggregateRoot, UniqueEntityID, DomainError } from '../../core/domain'
import { Result, ok } from '../../core/utils'
import { StoredEvent } from '../eventStore'

interface FileProps {
  filename: string
  forProject: Project['id']
  createdBy: User['id']
  createdAt?: Date
  designation:
    | 'garantie-financiere'
    | 'dcr'
    | 'modification-request'
    | 'attestation-designation'
    | 'other'
  storedAt?: string
}

export class File extends AggregateRoot<FileProps, StoredEvent> {
  private constructor(props: FileProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get filename() {
    return this.props.filename
  }

  get forProject() {
    return this.props.forProject
  }

  get createdBy() {
    return this.props.createdBy
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }

  get designation() {
    return this.props.designation
  }

  get storedAt(): string | undefined {
    return this.props.storedAt
  }

  public registerStorage(storageIdentifier: string) {
    this.props.storedAt = storageIdentifier
  }

  public static create(props: FileProps, id?: UniqueEntityID): Result<File, DomainError> {
    const file = new File({ ...props, createdAt: props.createdAt || new Date() }, id)

    return ok(file)
  }
}
