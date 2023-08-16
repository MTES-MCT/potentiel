import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { ok } from '../../../core/utils';
import { ProjectAppelOffre, User } from '../../../entities';
import { jest } from '@jest/globals';
import { CertificateTemplate } from '@potentiel/domain-views';
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
} from '../../../modules/project';
import { ProjectNotQualifiedForCovidDelay } from '../../../modules/shared';

export const makeFakeProject = (data: Partial<ProjectDataProps> = {}) => ({
  notify: jest.fn(() => ok<null, ProjectAlreadyNotifiedError>(null)),
  import: jest.fn((args) => ok<null, never>(null)),
  abandon: jest.fn((user: User) => ok<null, EliminatedProjectCannotBeAbandonnedError>(null)),
  abandonLegacy: jest.fn((abandonnedOn: number) => ok<null, never>(null)),
  correctData: jest.fn((user: User, data: ProjectDataCorrectedPayload['correctedData']) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null),
  ),
  setNotificationDate: jest.fn((user: User, notifiedOn: number) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null),
  ),
  setCompletionDueDate: jest.fn(() => ok<null, never>(null)),
  moveCompletionDueDate: jest.fn((user: User, delayInMonths: number) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>(null),
  ),
  updateCertificate: jest.fn((user: User, certificateFileId: string) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null),
  ),
  updatePuissance: jest.fn((user: User, newPuissance: number) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null),
  ),
  updateActionnaire: jest.fn((user: User, newActionnaire: string) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null),
  ),
  updateProducteur: jest.fn((user: User, newProducteur: string) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null),
  ),
  updateFournisseurs: jest.fn(
    (user: User, newFournisseurs: Fournisseur[], newEvaluationCarbone?: number) =>
      ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null),
  ),
  grantClasse: jest.fn((user: User) => ok<null, never>(null)),
  addGeneratedCertificate: jest.fn(
    (args: { projectVersionDate: Date; certificateFileId: string }) => ok<null, never>(null),
  ),

  submitGarantiesFinancieres: jest.fn((gfDate: Date, fileId: string, submittedBy: User) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError>(null),
  ),
  removeGarantiesFinancieres: jest.fn((removedBy: User) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError>(null),
  ),
  uploadGarantiesFinancieres: jest.fn((gfDate: Date, fileId: string, submittedBy: User) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError>(null),
  ),
  withdrawGarantiesFinancieres: jest.fn((removedBy: User) =>
    ok<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError>(null),
  ),
  applyCovidDelay: jest.fn(() => ok<null, ProjectNotQualifiedForCovidDelay>(null)),
  signalerDemandeDelai: jest.fn(
    (args: {
      decidedOn: Date;
      newCompletionDueOn: Date;
      status: 'acceptée' | 'rejetée' | 'accord-de-principe';
      notes?: string;
      attachments: Array<{ id: string; name: string }>;
      signaledBy: User;
    }) => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null),
  ),
  signalerDemandeAbandon: jest.fn(
    (args: {
      decidedOn: Date;
      status: 'acceptée' | 'rejetée';
      notes?: string;
      attachments: Array<{ id: string; name: string }>;
      signaledBy: User;
    }) => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null),
  ),
  signalerDemandeRecours: jest.fn(
    (args: {
      decidedOn: Date;
      status: 'acceptée' | 'rejetée';
      notes?: string;
      attachments: Array<{ id: string; name: string }>;
      signaledBy: User;
    }) => ok<null, ProjectCannotBeUpdatedIfUnnotifiedError>(null),
  ),
  modifierAppelOffre: jest.fn((appelOffre: { id: string }) => ok<null, null>(null)),
  addGFExpirationDate: jest.fn(
    (args: { expirationDate: Date; submittedBy: User; projectId: string }) =>
      ok<null | ProjectCannotBeUpdatedIfUnnotifiedError>(null),
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
  cahierDesCharges: { type: 'initial' },
  appelOffreId: 'fake-appel-offre-id',
  periodeId: '1',
  data,
  id: new UniqueEntityID('project1'),
  completionDueOn: 0,
  abandonedOn: 0,
  identifiantGestionnaireRéseau: '',
  délaiCDC2022appliqué: false,
  soumisAuxGF: false,
  GFValidées: false,
  notifiedOn: new Date('2020-01-01').getTime(),
  hasCurrentGf: false,
});
