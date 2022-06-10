import { UniqueEntityID } from '@core/domain'
import { isDefined, makeValidator, ok, Result } from '@core/utils'
import { makeProjectFilePath } from '../../helpers/makeProjectFilePath'
import { IllegalFileDataError } from './errors'

type FileDesignation =
  | 'garantie-financiere'
  | 'dcr'
  | 'modification-request'
  | 'modification-request-response'
  | 'attestation-designation'
  | 'attestation-designation-proof' // attestation uploaded by user when he claims a project ownership
  | 'ptf'
  | 'fichier-attaché-au-projet'
  | 'courrier-modification-historique'
  | 'listing-edf'
  | 'listing-enedis'
  | 'other'

/* global NodeJS */
export type FileContents = NodeJS.ReadableStream

export interface FileObject {
  readonly id: UniqueEntityID
  readonly filename: string
  readonly forProject: UniqueEntityID | undefined
  readonly createdBy: UniqueEntityID | undefined
  readonly designation: FileDesignation
  readonly createdAt: Date
  readonly contents: FileContents
  readonly path: string
}

export interface FileObjectArgs {
  id?: UniqueEntityID
  createdAt?: Date
  filename: string
  forProject?: UniqueEntityID
  createdBy?: UniqueEntityID
  designation: FileDesignation
  contents: FileContents
}

const validateFileArgs = makeValidator<FileObjectArgs, typeof IllegalFileDataError>(
  {
    filename: isDefined,
    designation: isDefined,
    contents: isDefined,
  },
  IllegalFileDataError
)

export const makeFileObject = (args: FileObjectArgs): Result<FileObject, IllegalFileDataError> => {
  return validateFileArgs(args).andThen((args) => {
    const { filename, forProject, createdBy, designation, contents, id, createdAt } = args
    return ok({
      filename,
      forProject,
      createdBy,
      designation,
      contents,
      createdAt: createdAt || new Date(),
      id: id || new UniqueEntityID(),
      get path() {
        return forProject ? makeProjectFilePath(forProject.toString(), filename).filepath : filename
      },
    })
  })
}
