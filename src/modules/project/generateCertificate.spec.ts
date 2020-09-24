import { makeGenerateCertificate } from './generateCertificate'
import { Readable } from 'stream'
import { Project, makeProject } from '../../entities'

import { okAsync } from '../../core/utils'

import { UnwrapForTest, Ok } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import addAppelOffreToProject from '../../__tests__/fixtures/addAppelOffreToProject'

import { FileService, FileContainer, File } from '../file/'

const mockFileServiceSave = jest.fn((file: File, fileContents: FileContainer) =>
  okAsync(null)
)
jest.mock('../file/FileService', () => ({
  FileService: function () {
    return {
      save: mockFileServiceSave,
    }
  },
}))

const MockFileService = <jest.Mock<FileService>>FileService

describe('generateCertificate', () => {
  const fileService = new MockFileService()
  const project: Project = UnwrapForTest(
    makeProject(
      makeFakeProject({
        classe: 'Classé',
        notifiedOn: 1,
        appelOffreId: 'Fessenheim',
        periodeId: '2',
      })
    )
  )

  addAppelOffreToProject(project)

  const findProjectById = jest.fn(async (projectId: Project['id']) => project)
  const buildCertificate = jest.fn((template: string, project: Project) =>
    okAsync<NodeJS.ReadableStream, Error>(
      Readable.from('test') as NodeJS.ReadableStream
    )
  )
  const saveProject = jest.fn(async (project: Project) => Ok(null))

  const generateCertificate = makeGenerateCertificate({
    fileService,
    findProjectById,
    saveProject,
    buildCertificate,
  })

  let result
  beforeAll(async () => {
    result = await generateCertificate(project.id)
  })

  it('should retrieve the project entity', () => {
    expect(findProjectById).toHaveBeenCalledWith(project.id)
  })

  it('should generate a pdf using the template defined by the project periode', async () => {
    expect(buildCertificate).toHaveBeenCalledWith('v0', project)
  })

  it('should save the pdf file using the file service', () => {
    expect(mockFileServiceSave).toHaveBeenCalled()
  })

  it('should return the id to the saved file', () => {
    const fileId = mockFileServiceSave.mock.calls[0][0].id.toString()
    expect(fileId).toBeDefined()

    expect(result.isOk()).toBe(true)
    if (result.isErr()) return console.log(result.error)

    expect(result.value).toEqual(fileId)
  })
})
