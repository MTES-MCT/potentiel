import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { ok } from '../../../core/utils'
import { CertificateTemplate, ProjectAppelOffre, User } from '../../../entities'
import { Fournisseur } from '../../../modules/project'
import { ProjectDataForCertificate } from '../../../modules/project/dtos'
import {
  EliminatedProjectCannotBeAbandonnedError,
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
  reimport: jest.fn((args) => ok<null, never>(null)),
  import: jest.fn((args) => ok<null, never>(null)),
  abandon: jest.fn((user: User) => ok<null, EliminatedProjectCannotBeAbandonnedError>(null)),
  abandonLegacy: jest.fn((abandonnedOn: number) => ok<null, never>(null)),
  correctData: jest.fn((user: User, data: ProjectDataCorrectedPayload['correctedData']) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  setNotificationDate: jest.fn((user: User, notifiedOn: number) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  setCompletionDueDate: jest.fn((completionDueOn: number) => ok<null, never>(null)),
  moveCompletionDueDate: jest.fn((user: User, delayInMonths: number) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  updateCertificate: jest.fn((user: User, certificateFileId: string) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)
  ),
  updatePuissance: jest.fn((user: User, newPuissance: number) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)
  ),
  updateActionnaire: jest.fn((user: User, newActionnaire: string) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)
  ),
  updateProducteur: jest.fn((user: User, newProducteur: string) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)
  ),
  updateFournisseurs: jest.fn(
    (user: User, newFournisseurs: Fournisseur[], newEvaluationCarbone?: number) =>
      ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)
  ),
  grantClasse: jest.fn((user: User) => ok<null, never>(null)),
  addGeneratedCertificate: jest.fn(
    (args: { projectVersionDate: Date; certificateFileId: string }) => ok<null, never>(null)
  ),
  certificateData: ok({
    template: 'v1' as CertificateTemplate,
    data: {} as ProjectDataForCertificate,
  }),
  certificateFilename: '',
  shouldCertificateBeGenerated: true,
  pendingEvents: [] as DomainEvent[],
  appelOffre: {} as ProjectAppelOffre,
  isClasse: true,
  puissanceInitiale: 0,
  lastUpdatedOn: new Date(0),
  lastCertificateUpdate: undefined,
  newRulesOptIn: false,
  data,
  id: new UniqueEntityID('project1'),
})
