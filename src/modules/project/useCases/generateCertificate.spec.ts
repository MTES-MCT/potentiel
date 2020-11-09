import { Readable } from 'stream'
import { UniqueEntityID } from '../../../core/domain'
import { ok, okAsync } from '../../../core/utils'
import { CertificateTemplate } from '../../../entities'
import { fakeRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { File, FileContainer, FileService } from '../../file'
import { OtherError } from '../../shared'
import { ProjectDataForCertificate } from '../dtos'
import { makeGenerateCertificate } from './generateCertificate'
import { Project } from '../Project'

const mockFileServiceSave = jest.fn((file: File, fileContents: FileContainer) => okAsync(null))
jest.mock('../../file/FileService', () => ({
  FileService: function () {
    return {
      save: mockFileServiceSave,
    }
  },
}))

const MockFileService = <jest.Mock<FileService>>FileService

const projectId = 'project1'

const fakeProjectData = {}

const fakeProject = {
  ...makeFakeProject(),
  certificateData: ok({ template: 'v0', data: fakeProjectData as ProjectDataForCertificate }),
  id: new UniqueEntityID(projectId),
}

const projectRepo = fakeRepo(fakeProject as Project)

describe('generateCertificate', () => {
  const fileService = new MockFileService()

  /* global NodeJS */
  const buildCertificate = jest.fn(
    (args: { template: CertificateTemplate; data: ProjectDataForCertificate }) =>
      okAsync<NodeJS.ReadableStream, OtherError>(Readable.from('test') as NodeJS.ReadableStream)
  )

  const generateCertificate = makeGenerateCertificate({
    fileService,
    projectRepo,
    buildCertificate,
  })

  beforeAll(async () => {
    const res = await generateCertificate(projectId)
    expect(res.isOk()).toBe(true)
  })

  it('should load the project', () => {
    expect(projectRepo.load).toHaveBeenCalledWith(new UniqueEntityID(projectId))
  })

  it('should generate a pdf using the template defined by the project periode', async () => {
    expect(buildCertificate).toHaveBeenCalledWith({ template: 'v0', data: fakeProjectData })
  })

  it('should save the pdf file using the file service', () => {
    expect(mockFileServiceSave).toHaveBeenCalled()
  })

  it('should call project.addGeneratedCertificate()', () => {
    expect(fakeProject.addGeneratedCertificate).toHaveBeenCalled()
  })

  it('should save the project', () => {
    expect(projectRepo.save).toHaveBeenCalledWith(fakeProject)
  })
})
