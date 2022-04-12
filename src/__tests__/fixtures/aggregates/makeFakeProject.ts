import { DomainEvent, UniqueEntityID } from '@core/domain'
import { ok } from '@core/utils'
import { CertificateTemplate, ProjectAppelOffre, User } from '@entities'
import {
  Fournisseur,
  ProjectDataForCertificate,
  EliminatedProjectCannotBeAbandonnedError,
  IllegalProjectDataError,
  ProjectAlreadyNotifiedError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  ProjectDataCorrectedPayload,
  ProjectDataProps,
  GFCertificateHasAlreadyBeenSentError,
  NoGFCertificateToDeleteError,
} from '@modules/project'

export const makeFakeProject = (data: Partial<ProjectDataProps> = {}) => ({
  notify: jest.fn((notifiedOn: number) =>
    ok<null, IllegalProjectDataError | ProjectAlreadyNotifiedError>(null)
  ),
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
  submitGarantiesFinancieres: jest.fn((gfDate: Date, fileId: string, submittedBy: User) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError>(null)
  ),
  removeGarantiesFinancieres: jest.fn((removedBy: User) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError>(null)
  ),
  uploadGarantiesFinancieres: jest.fn((gfDate: Date, fileId: string, submittedBy: User) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError>(null)
  ),
  withdrawGarantiesFinancieres: jest.fn((removedBy: User) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError>(null)
  ),
  signalerDemandeDelai: jest.fn(
    (args: {
      decidedOn: Date
      newCompletionDueOn: Date
      isAccepted: boolean
      notes?: string
      signaledBy: User
    }) => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)
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
  isLegacy: false,
  puissanceInitiale: 0,
  lastUpdatedOn: new Date(0),
  lastCertificateUpdate: undefined,
  newRulesOptIn: false,
  data,
  id: new UniqueEntityID('project1'),
})
