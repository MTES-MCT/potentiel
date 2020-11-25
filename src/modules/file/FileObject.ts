import { UniqueEntityID } from '../../core/domain'
import { ok, Result } from '../../core/utils'

type FileDesignation =
  | 'garantie-financiere'
  | 'dcr'
  | 'modification-request'
  | 'attestation-designation'
  | 'other'

export interface FileObject {
  readonly filename: string
  readonly forProject: UniqueEntityID
  readonly createdBy: UniqueEntityID
  readonly designation: FileDesignation
  readonly createdAt: Date
  readonly storedAt: string | undefined
  addStorage: (storedAt: string) => void
}

interface FileObjectArgs {
  filename: string
  forProject: UniqueEntityID
  createdBy: UniqueEntityID
  designation: FileDesignation
}

export const makeFileObject = (args: FileObjectArgs): Result<FileObject, never> => {
  const { filename, forProject, createdBy, designation } = args

  let storedAt: string | undefined

  return ok({
    filename,
    forProject,
    createdBy,
    designation,
    createdAt: new Date(),
    get storedAt() {
      return storedAt
    },
    addStorage: (_storedAt: string) => {
      storedAt = _storedAt
    },
  })
}
