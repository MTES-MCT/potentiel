import { UniqueEntityID } from '../../../core/domain'
import { ok } from '../../../core/utils'
import { ProjectAppelOffre, User } from '../../../entities'
import { StoredEvent } from '../../../modules/eventStore'
import { ProjectDataForCertificate } from '../../../modules/project/dtos'
import {
  IllegalProjectDataError,
  ProjectAlreadyNotifiedError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from '../../../modules/project/errors'
import { ProjectDataCorrectedPayload } from '../../../modules/project/events'
import { ProjectDataProps } from '../../../modules/project/Project'

export const makeFakeProject = (data: Partial<ProjectDataProps> = {}) => ({
  notify: jest.fn((notifiedOn: number) =>
    ok<null, IllegalProjectDataError | ProjectAlreadyNotifiedError>(null)
  ),
  correctData: jest.fn((user: User, data: ProjectDataCorrectedPayload['correctedData']) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  setNotificationDate: jest.fn((user: User, notifiedOn: number) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  setCompletionDueDate: jest.fn((user: User, completionDueOn: number) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  updateCertificate: jest.fn((user: User, certificateFileId: string) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)
  ),
  grantClasse: jest.fn((user: User) => ok<null, never>(null)),
  addGeneratedCertificate: jest.fn(
    (args: { projectVersionDate: Date; certificateFileId: string }) => ok<null, never>(null)
  ),
  certificateData: ok({ template: 'v1', data: {} as ProjectDataForCertificate }),
  certificateFilename: '',
  shouldCertificateBeGenerated: true,
  pendingEvents: [] as StoredEvent[],
  appelOffre: {} as ProjectAppelOffre,
  isClasse: true,
  lastUpdatedOn: new Date(0),
  lastCertificateUpdate: undefined,
  data,
  id: new UniqueEntityID('project1'),
})
