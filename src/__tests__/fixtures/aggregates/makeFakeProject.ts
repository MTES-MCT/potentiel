import { DomainEvent, UniqueEntityID } from '@core/domain'
import { ok } from '@core/utils'
import { CertificateTemplate, ProjectAppelOffre } from '@entities'
import {
  ProjectDataForCertificate,
  EliminatedProjectCannotBeAbandonnedError,
  IllegalProjectDataError,
  ProjectAlreadyNotifiedError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  ProjectDataProps,
  GFCertificateHasAlreadyBeenSentError,
  DCRCertificatDéjàEnvoyéError,
  PTFCertificatDéjàEnvoyéError,
  NoGFCertificateToDeleteError,
} from '@modules/project'
import { ProjectNotQualifiedForCovidDelay } from '@modules/shared'

export const makeFakeProject = (data: Partial<ProjectDataProps> = {}) => ({
  notify: jest.fn(() => ok<null, ProjectAlreadyNotifiedError>(null)),
  import: jest.fn(() => ok<null, never>(null)),
  abandon: jest.fn(() => ok<null, EliminatedProjectCannotBeAbandonnedError>(null)),
  abandonLegacy: jest.fn(() => ok<null, never>(null)),
  correctData: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  setNotificationDate: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  setCompletionDueDate: jest.fn(() => ok<null, never>(null)),
  moveCompletionDueDate: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null)
  ),
  updateCertificate: jest.fn(() => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
  updatePuissance: jest.fn(() => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
  updateActionnaire: jest.fn(() => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
  updateProducteur: jest.fn(() => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
  updateFournisseurs: jest.fn(() => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
  grantClasse: jest.fn(() => ok<null, never>(null)),
  addGeneratedCertificate: jest.fn(() => ok<null, never>(null)),

  submitGarantiesFinancieres: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError>(null)
  ),
  submitDemandeComplèteRaccordement: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | DCRCertificatDéjàEnvoyéError>(null)
  ),
  submitPropositionTechniqueFinancière: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | PTFCertificatDéjàEnvoyéError>(null)
  ),
  removeGarantiesFinancieres: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError>(null)
  ),
  uploadGarantiesFinancieres: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError>(null)
  ),
  withdrawGarantiesFinancieres: jest.fn(() =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError>(null)
  ),
  applyCovidDelay: jest.fn(() => ok<null, ProjectNotQualifiedForCovidDelay>(null)),
  signalerDemandeDelai: jest.fn(() => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
  signalerDemandeAbandon: jest.fn(() => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
  signalerDemandeRecours: jest.fn(() => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
  modifierAppelOffre: jest.fn(() => ok<null, null>(null)),
  addGFExpirationDate: jest.fn(() => ok<null | ProjectCannotBeUpdatedIfUnnotifiedError>(null)),
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
  cahierDesCharges: { paruLe: 'initial' },
  appelOffreId: 'fake-appel-offre-id',
  periodeId: '1',
  data,
  id: new UniqueEntityID('project1'),
  completionDueOn: 0,
  abandonedOn: 0,
})
