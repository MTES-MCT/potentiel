import { okAsync } from 'neverthrow'
import { Readable } from 'node:stream'
import { UniqueEntityID } from '../core/domain'
import { makeParseEdfCsv } from './parseEdfCsv'

describe('parseEdfCsv', () => {
  const fakeFileStream = Readable.from('column1,column2\nvalue1,value2')
  const fileId = '123'

  it('should fetch the file and parse the contents', async () => {
    const fakeLoad = jest.fn((fileId: UniqueEntityID) =>
      okAsync({
        id: fileId,
        filename: 'filename',
        designation: 'upload-edf' as 'upload-edf',
        createdAt: new Date(),
        contents: fakeFileStream,
        path: 'path',
        forProject: undefined,
        createdBy: undefined,
      })
    )

    const parseEdfCsv = makeParseEdfCsv({ fileRepo: { load: fakeLoad, save: jest.fn() } })

    const result = await parseEdfCsv(fileId)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      column1: 'value1',
      column2: 'value2',
    })
  })
})
