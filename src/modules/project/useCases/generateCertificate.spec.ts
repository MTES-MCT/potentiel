import { Readable } from 'stream'
import { Repository, UniqueEntityID } from '@core/domain'
import { ok, okAsync } from '@core/utils'
import { CertificateTemplate } from '../../../entities'
import { fakeRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { FileObject } from '../../file'
import { OtherError } from '../../shared'
import { ProjectDataForCertificate } from '../dtos'
import { Project } from '../Project'
import { makeGenerateCertificate } from './generateCertificate'

const projectId = 'project1'

const fakeProjectData = {}

const fakeProject = {
  ...makeFakeProject(),
  certificateData: ok({ template: 'v0', data: fakeProjectData as ProjectDataForCertificate }),
  id: new UniqueEntityID(projectId),
}

const projectRepo = fakeRepo(fakeProject as Project)

describe('generateCertificate', () => {
  /* global NodeJS */
  const buildCertificate = jest.fn(
    (args: { template: CertificateTemplate; data: ProjectDataForCertificate }) =>
      okAsync<NodeJS.ReadableStream, OtherError>(Readable.from('test') as NodeJS.ReadableStream)
  )

  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  }

  const generateCertificate = makeGenerateCertificate({
    fileRepo: fileRepo as Repository<FileObject>,
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
    expect(fileRepo.save).toHaveBeenCalled()
  })

  it('should call project.addGeneratedCertificate()', () => {
    expect(fakeProject.addGeneratedCertificate).toHaveBeenCalled()
  })

  it('should save the project', () => {
    expect(projectRepo.save).toHaveBeenCalledWith(fakeProject)
  })
})
