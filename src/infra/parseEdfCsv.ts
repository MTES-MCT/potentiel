import { Repository, UniqueEntityID } from '../core/domain'
import { parseCsvFromStream } from '../helpers/parseCsvFromStream'
import { FileObject } from '../modules/file'

type ParseEdfCsvDeps = {
  fileRepo: Repository<FileObject>
}

export const makeParseEdfCsv =
  ({ fileRepo }: ParseEdfCsvDeps) =>
  async (fileId: string): Promise<any[]> => {
    const fileResult = await fileRepo.load(new UniqueEntityID(fileId))

    if (fileResult.isErr()) {
      throw fileResult.error
    }

    const linesResult = await parseCsvFromStream(fileResult.value.contents, {
      delimiter: ',',
      encoding: 'utf8',
    })

    if (linesResult.isErr()) {
      throw linesResult.error
    }

    return linesResult.value
  }
