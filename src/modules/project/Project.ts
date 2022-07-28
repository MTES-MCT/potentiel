import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import {
  err,
  isPositiveNumber,
  isStrictlyPositiveNumber,
  makePropertyValidator,
  ok,
  Result,
} from '@core/utils'
import { CertificateTemplate, ProjectAppelOffre, Technologie, User } from '@entities'
import { isNotifiedPeriode } from '@entities/periode'
import { getDelaiDeRealisation, GetProjectAppelOffre } from '@modules/projectAppelOffre'
import remove from 'lodash/remove'
import moment from 'moment-timezone'
import sanitize from 'sanitize-filename'
import { BuildProjectIdentifier, Fournisseur } from '.'
import { shallowDelta } from '../../helpers/shallowDelta'
import {
  EntityNotFoundError,
  HeterogeneousHistoryError,
  IllegalInitialStateForAggregateError,
  IncompleteDataError,
} from '../shared'
import { ProjectDataForCertificate } from './dtos'
import {
  AttachmentRequiredForDemandeRecoursAcceptedError,
  EliminatedProjectCannotBeAbandonnedError,
  GFCertificateHasAlreadyBeenSentError,
  IllegalProjectStateError,
  NoGFCertificateToDeleteError,
  NoGFCertificateToUpdateError,
  ProjectAlreadyNotifiedError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  ProjectNotEligibleForCertificateError,
} from './errors'
import {
  AppelOffreProjetModifié,
  CovidDelayGranted,
  DateEchéanceGFAjoutée,
  DemandeAbandonSignaled,
  DemandeDelaiSignaled,
  DemandeRecoursSignaled,
  IdentifiantPotentielPPE2Batiment2Corrigé,
  LegacyProjectSourced,
  ProjectAbandoned,
  ProjectActionnaireUpdated,
  ProjectCertificateGenerated,
  ProjectCertificateObsolete,
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
  ProjectClasseGranted,
  ProjectCompletionDueDateCancelled,
  ProjectCompletionDueDateSet,
  ProjectDataCorrected,
  ProjectDataCorrectedPayload,
  ProjectDCRDueDateCancelled,
  ProjectDCRDueDateSet,
  ProjectFournisseursUpdated,
  ProjectGFDueDateCancelled,
  ProjectGFDueDateSet,
  ProjectGFInvalidated,
  ProjectGFRemoved,
  ProjectGFSubmitted,
  ProjectGFUploaded,
  ProjectGFWithdrawn,
  ProjectImported,
  ProjectImportedPayload,
  ProjectNotificationDateSet,
  ProjectNotified,
  ProjectProducteurUpdated,
  ProjectPuissanceUpdated,
  ProjectReimported,
} from './events'
import { toProjectDataForCertificate } from './mappers'

export interface Project extends EventStoreAggregate {
  notify: (args: {
    appelOffre: ProjectAppelOffre
    notifiedOn: number
  }) => Result<null, IllegalProjectStateError | ProjectAlreadyNotifiedError>
  abandon: (user: User) => Result<null, EliminatedProjectCannotBeAbandonnedError>
  abandonLegacy: (abandonnedOn: number) => Result<null, never>
  import: (args: {
    appelOffre: ProjectAppelOffre
    data: ProjectImportedPayload['data']
    importId: string
  }) => Result<null, IllegalProjectStateError | EntityNotFoundError>
  correctData: (
    user: User,
    data: ProjectDataCorrectedPayload['correctedData']
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectStateError>
  setNotificationDate: (
    user: User | null,
    notifiedOn: number
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectStateError>
  moveCompletionDueDate: (
    user: User,
    delayInMonths: number
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectStateError>
  setCompletionDueDate: (args: {
    appelOffre: ProjectAppelOffre
    completionDueOn: number
  }) => Result<null, never>
  updateCertificate: (
    user: User,
    certificateFileId: string
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  updatePuissance: (
    user: User,
    newPuissance: number
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  updateActionnaire: (
    user: User,
    newActionnaire: string
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  updateProducteur: (
    user: User,
    newProducteur: string
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  updateFournisseurs: (
    user: User,
    newFournisseurs: Fournisseur[],
    newEvaluationCarbone?: number
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  grantClasse: (user: User) => Result<null, never>
  addGeneratedCertificate: (args: {
    projectVersionDate: Date
    certificateFileId: string
    reason?: string
  }) => Result<null, IllegalInitialStateForAggregateError>
  submitGarantiesFinancieres: (
    gfDate: Date,
    fileId: string,
    submittedBy: User,
    expirationDate: Date
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError>
  uploadGarantiesFinancieres: (
    gfDate: Date,
    fileId: string,
    submittedBy: User,
    expirationDate: Date
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | GFCertificateHasAlreadyBeenSentError>
  removeGarantiesFinancieres: (
    removedBy: User
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError>
  withdrawGarantiesFinancieres: (
    removedBy: User
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToDeleteError>
  signalerDemandeDelai: (
    args: {
      decidedOn: Date
      notes?: string
      attachment?: { id: string; name: string }
      signaledBy: User
    } & (
      | {
          status: 'acceptée'
          newCompletionDueOn: Date
        }
      | {
          status: 'rejetée' | 'accord-de-principe'
        }
    )
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  signalerDemandeAbandon: (args: {
    decidedOn: Date
    notes?: string
    attachment?: { id: string; name: string }
    signaledBy: User
    status: 'acceptée' | 'rejetée'
  }) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  signalerDemandeRecours: (args: {
    decidedOn: Date
    notes?: string
    signaledBy: User
    status: 'acceptée' | 'rejetée'
    attachment?: { id: string; name: string }
  }) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  addGFExpirationDate: (args: {
    projectId: string
    expirationDate: Date
    submittedBy: User
  }) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | NoGFCertificateToUpdateError>
  removeUnexpectedGFDueDateforPPE2Project: () => Result<null, null>
  readonly shouldCertificateBeGenerated: boolean
  readonly isClasse?: boolean
  readonly isLegacy?: boolean
  readonly puissanceInitiale: number
  readonly certificateData: Result<
    {
      template: CertificateTemplate
      data: ProjectDataForCertificate
    },
    | IncompleteDataError
    | ProjectNotEligibleForCertificateError
    | IllegalInitialStateForAggregateError
  >
  readonly certificateFilename: string
  readonly data: ProjectDataProps | undefined
  readonly lastCertificateUpdate: Date | undefined
  readonly newRulesOptIn: boolean
  readonly appelOffreId: string
  readonly periodeId: string
  readonly familleId?: string
  readonly completionDueOn: number
}

export interface ProjectDataProps {
  numeroCRE: string
  appelOffreId: string
  periodeId: string
  familleId: string
  nomProjet: string
  territoireProjet: string
  puissance: number
  prixReference: number
  evaluationCarbone: number
  note: number
  nomCandidat: string
  nomRepresentantLegal: string
  email: string
  adresseProjet: string
  codePostalProjet: string
  communeProjet: string
  engagementFournitureDePuissanceAlaPointe: boolean
  isFinancementParticipatif: boolean
  isInvestissementParticipatif: boolean
  motifsElimination: string
  details: Record<string, string>
  technologie: Technologie
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee'
  classe: 'Classé' | 'Eliminé'
}

export interface ProjectProps {
  projectId: UniqueEntityID
  appelOffre?: ProjectAppelOffre
  notifiedOn: number
  abandonedOn: number
  completionDueOn: number
  hasCompletionDueDateMoved: boolean
  lastUpdatedOn?: Date
  lastCertificateUpdate: Date | undefined
  hasError: boolean
  isClasse?: boolean
  puissanceInitiale: number
  data: ProjectDataProps | undefined
  newRulesOptIn: boolean
  fieldsUpdatedAfterImport: Set<string>
  potentielIdentifier?: string
  hasCurrentGf: boolean
  GFExpirationDate: Date | undefined
  appelOffreId: string
  periodeId: string
  familleId: string
  hasProducteurChange: boolean
}

const projectValidator = makePropertyValidator({
  puissance: isStrictlyPositiveNumber,
  prixReference: isPositiveNumber,
  note: isPositiveNumber,
  evaluationCarbone: isPositiveNumber,
})

export const makeProject = (args: {
  projectId: UniqueEntityID
  history?: DomainEvent[]
  getProjectAppelOffre: GetProjectAppelOffre
  buildProjectIdentifier: BuildProjectIdentifier
}): Result<Project, EntityNotFoundError | HeterogeneousHistoryError> => {
  const { history, projectId, getProjectAppelOffre, buildProjectIdentifier } = args

  if (!_allEventsHaveSameAggregateId()) {
    return err(new HeterogeneousHistoryError())
  }

  const pendingEvents: DomainEvent[] = []
  const props: ProjectProps = {
    notifiedOn: 0,
    abandonedOn: 0,
    completionDueOn: 0,
    hasCompletionDueDateMoved: false,
    projectId,
    puissanceInitiale: 0,
    data: undefined,
    hasError: false,
    lastCertificateUpdate: undefined,
    newRulesOptIn: false,
    fieldsUpdatedAfterImport: new Set<string>(),
    hasCurrentGf: false,
    GFExpirationDate: undefined,
    potentielIdentifier: '',
    appelOffreId: '',
    periodeId: '',
    familleId: '',
    hasProducteurChange: false,
  }

  // Initialize aggregate by processing each event in history
  if (history) {
    if (history.length === 0) {
      return err(new EntityNotFoundError())
    }

    for (const event of history) {
      _processEvent(event)

      if (props.hasError) {
        const errorMessage = `Problème lors du traitement de l'événement ${event.type} par _ProcessEvent pour le projet ${projectId}`
        return err(new IllegalInitialStateForAggregateError({ projectId, errorMessage }))
      }
    }

    _updateAppelOffre({
      appelOffreId: props.appelOffreId,
      periodeId: props.periodeId,
      familleId: props.familleId,
    })
  }

  // public methods
  return ok({
    notify: function ({ appelOffre, notifiedOn }) {
      const { data, projectId } = props

      if (props.notifiedOn) {
        return err(new ProjectAlreadyNotifiedError())
      }

      _publishEvent(
        new ProjectNotified({
          payload: {
            projectId: projectId.toString(),
            appelOffreId: appelOffre.id,
            periodeId: appelOffre.periode.id,
            familleId: appelOffre.famille?.id,
            candidateEmail: data?.email || '',
            candidateName: data?.nomRepresentantLegal || '',
            notifiedOn,
          },
        })
      )

      _updateDCRDate(appelOffre)
      _updateCompletionDate(appelOffre)
      !appelOffre.garantiesFinancieresDeposeesALaCandidature && _updateGFDate(appelOffre)

      return ok(null)
    },
    abandon: function (user) {
      if (!props.isClasse) {
        return err(new EliminatedProjectCannotBeAbandonnedError())
      }

      _publishEvent(
        new ProjectAbandoned({
          payload: {
            projectId: projectId.toString(),
            abandonAcceptedBy: user.id,
          },
        })
      )

      return ok(null)
    },
    abandonLegacy: function (abandonnedOn) {
      if (props.isClasse) {
        _publishEvent(
          new ProjectAbandoned({
            payload: {
              projectId: projectId.toString(),
              abandonAcceptedBy: '',
            },
            original: {
              version: 1,
              occurredAt: new Date(abandonnedOn),
            },
          })
        )
      }

      return ok(null)
    },
    import: function ({ appelOffre, data, importId }) {
      const { appelOffreId, periodeId, familleId, numeroCRE } = data

      const id = projectId.toString()

      if (_isNew()) {
        _publishEvent(
          new ProjectImported({
            payload: {
              projectId: id,
              appelOffreId,
              periodeId,
              familleId,
              numeroCRE,
              importId,
              data,
              potentielIdentifier: buildProjectIdentifier({
                appelOffreId,
                periodeId,
                familleId,
                numeroCRE,
              }),
            },
          })
        )
        if (data.notifiedOn) {
          try {
            isStrictlyPositiveNumber(data.notifiedOn)
          } catch (e) {
            return err(new IllegalProjectStateError({ notifiedOn: e.message }))
          }

          _publishNewNotificationDate({
            projectId: id,
            notifiedOn: data.notifiedOn,
            setBy: '',
          })

          _updateDCRDate(appelOffre)
          _updateGFDate(appelOffre)
          _updateCompletionDate(appelOffre)
        }
      } else {
        const changes = _computeDelta(data)

        for (const updatedField of props.fieldsUpdatedAfterImport) {
          if (updatedField.startsWith('details.') && changes.details) {
            delete changes.details[updatedField.substring('details.'.length)]
            continue
          }
          delete changes[updatedField]
        }
        delete changes['notifiedOn']

        const previouslyNotified = !!props.notifiedOn
        const hasNotificationDateChanged = data.notifiedOn && data.notifiedOn !== props.notifiedOn

        if (Object.keys(changes).length) {
          _publishEvent(
            new ProjectReimported({
              payload: {
                projectId: id,
                appelOffreId,
                periodeId,
                familleId,
                importId,
                data: changes,
              },
            })
          )
        }

        if (hasNotificationDateChanged) {
          _publishNewNotificationDate({
            projectId: id,
            notifiedOn: data.notifiedOn,
            setBy: '',
          })
        }

        if (props.notifiedOn) {
          if (changes.classe) {
            if (data.classe === 'Classé') {
              // éliminé -> classé
              _updateDCRDate(appelOffre)
              _updateGFDate(appelOffre)
              _updateCompletionDate(appelOffre)
            } else if (data.classe === 'Eliminé') {
              // classé -> eliminé
              _cancelGFDate(appelOffre)
              _cancelDCRDate()
              _cancelCompletionDate()
            }

            if (previouslyNotified) {
              _publishEvent(
                new ProjectCertificateObsolete({
                  payload: {
                    projectId: id,
                  },
                })
              )
            }
          } else {
            if (props.isClasse) {
              if (hasNotificationDateChanged) {
                // remains classé
                _updateDCRDate(appelOffre)
                _updateGFDate(appelOffre)
                _updateCompletionDate(appelOffre)
              }
            }
            // remains éliminé
          }
        }
      }

      return ok(null)
    },
    correctData: function (user, corrections) {
      if (!_isNotified() || !props.data) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      const changes = _computeDelta(corrections)

      if (!changes || !Object.keys(changes).length) {
        return ok(null)
      }

      return _validateProjectFields(changes).andThen(() => {
        _publishEvent(
          new ProjectDataCorrected({
            payload: {
              projectId: props.projectId.toString(),
              correctedBy: user.id,
              correctedData: changes,
            },
          })
        )
        return ok(null)
      })
    },
    setCompletionDueDate: function ({ appelOffre, completionDueOn }) {
      _updateCompletionDate(appelOffre, {
        completionDueOn,
      })

      return ok(null)
    },
    moveCompletionDueDate: function (user, delayInMonths) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      const { completionDueOn, notifiedOn, appelOffre } = props

      const newCompletionDueOn = moment(completionDueOn)
        .add(delayInMonths, 'months')
        .toDate()
        .getTime()

      if (newCompletionDueOn <= notifiedOn) {
        return err(
          new IllegalProjectStateError({
            completionDueOn:
              'La nouvelle date de mise en service doit postérieure à la date de notification.',
          })
        )
      }

      appelOffre &&
        _updateCompletionDate(appelOffre, { setBy: user.id, completionDueOn: newCompletionDueOn })

      return ok(null)
    },
    setNotificationDate: function (user, notifiedOn) {
      if (!_isNew() && !_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }
      try {
        isStrictlyPositiveNumber(notifiedOn)
      } catch (e) {
        return err(new IllegalProjectStateError({ notifiedOn: e.message }))
      }

      // If it's the same day, ignore small differences in timestamp
      if (moment(notifiedOn).tz('Europe/Paris').isSame(props.notifiedOn, 'day')) return ok(null)

      _publishNewNotificationDate({
        projectId: props.projectId.toString(),
        notifiedOn,
        setBy: user?.id || '',
      })

      const { appelOffre } = props
      if (appelOffre) {
        _updateDCRDate(appelOffre)
        !appelOffre.garantiesFinancieresDeposeesALaCandidature && _updateGFDate(appelOffre)
        _updateCompletionDate(appelOffre)
      }

      return ok(null)
    },
    updateCertificate: function (user, certificateFileId) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      _publishEvent(
        new ProjectCertificateUpdated({
          payload: {
            projectId: props.projectId.toString(),
            certificateFileId,
            uploadedBy: user.id,
          },
        })
      )

      return ok(null)
    },
    updatePuissance: function (user, newPuissance) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      _publishEvent(
        new ProjectPuissanceUpdated({
          payload: {
            projectId: props.projectId.toString(),
            newPuissance,
            updatedBy: user.id,
          },
        })
      )

      return ok(null)
    },
    updateActionnaire: function (user, newActionnaire) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      _publishEvent(
        new ProjectActionnaireUpdated({
          payload: {
            projectId: props.projectId.toString(),
            newActionnaire,
            updatedBy: user.id,
          },
        })
      )

      return ok(null)
    },
    updateProducteur: function (user, newProducteur) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      _publishEvent(
        new ProjectProducteurUpdated({
          payload: {
            projectId: props.projectId.toString(),
            newProducteur,
            updatedBy: user.id,
          },
        })
      )

      const { appelOffre, isClasse } = props

      if (isClasse && appelOffre?.isSoumisAuxGFs) {
        _publishEvent(
          new ProjectGFDueDateSet({
            payload: {
              projectId: props.projectId.toString(),
              garantiesFinancieresDueOn: moment().add(1, 'months').toDate().getTime(),
            },
          })
        )

        if (props.hasCurrentGf) {
          _publishEvent(
            new ProjectGFInvalidated({
              payload: {
                projectId: props.projectId.toString(),
              },
            })
          )
        }
      }

      return ok(null)
    },
    updateFournisseurs: function (user, newFournisseurs: Fournisseur[], newEvaluationCarbone) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      _publishEvent(
        new ProjectFournisseursUpdated({
          payload: {
            projectId: props.projectId.toString(),
            newFournisseurs,
            newEvaluationCarbone,
            updatedBy: user.id,
          },
        })
      )

      return ok(null)
    },
    grantClasse: function (user) {
      if (!props.isClasse) {
        _publishEvent(
          new ProjectClasseGranted({
            payload: {
              projectId: props.projectId.toString(),
              grantedBy: user.id,
            },
          })
        )
      }

      return ok(null)
    },
    addGeneratedCertificate: function ({ projectVersionDate, certificateFileId, reason }) {
      if (!props.appelOffre) {
        const errorMessage = `Appel d'offre inaccessible dans project.addGeneratedCertificate pour le project ${projectId}`
        return err(new IllegalInitialStateForAggregateError({ projectId, errorMessage }))
      }

      if (props.lastCertificateUpdate) {
        _publishEvent(
          new ProjectCertificateRegenerated({
            payload: {
              projectId: props.projectId.toString(),
              projectVersionDate,
              certificateFileId,
              reason,
            },
          })
        )
      } else {
        _publishEvent(
          new ProjectCertificateGenerated({
            payload: {
              projectId: props.projectId.toString(),
              projectVersionDate,
              certificateFileId,
              appelOffreId: props.appelOffre.id,
              periodeId: props.appelOffre.periode.id,
              candidateEmail: props.data?.email || '',
            },
          })
        )
      }

      return ok(null)
    },
    submitGarantiesFinancieres: function (gfDate, fileId, submittedBy, expirationDate) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }
      if (props.hasCurrentGf) {
        return err(new GFCertificateHasAlreadyBeenSentError())
      }
      _publishEvent(
        new ProjectGFSubmitted({
          payload: {
            projectId: props.projectId.toString(),
            fileId,
            gfDate,
            submittedBy: submittedBy.id,
            expirationDate,
          },
        })
      )
      return ok(null)
    },
    uploadGarantiesFinancieres: function (gfDate, fileId, submittedBy, expirationDate) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }
      if (props.hasCurrentGf) {
        return err(new GFCertificateHasAlreadyBeenSentError())
      }
      _publishEvent(
        new ProjectGFUploaded({
          payload: {
            projectId: props.projectId.toString(),
            fileId: fileId,
            gfDate: gfDate,
            submittedBy: submittedBy.id,
            expirationDate,
          },
        })
      )
      return ok(null)
    },
    removeGarantiesFinancieres: function (removedBy) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }
      if (!props.hasCurrentGf) {
        return err(new NoGFCertificateToDeleteError())
      }
      _publishEvent(
        new ProjectGFRemoved({
          payload: {
            projectId: props.projectId.toString(),
            removedBy: removedBy.id,
          },
        })
      )
      return ok(null)
    },
    withdrawGarantiesFinancieres: function (removedBy) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }
      if (!props.hasCurrentGf) {
        return err(new NoGFCertificateToDeleteError())
      }
      _publishEvent(
        new ProjectGFWithdrawn({
          payload: {
            projectId: props.projectId.toString(),
            removedBy: removedBy.id,
          },
        })
      )
      return ok(null)
    },
    signalerDemandeDelai: function (args) {
      const { decidedOn, status, notes, attachment, signaledBy } = args
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      const isNewDateApplicable =
        status === 'acceptée' && props.completionDueOn < args.newCompletionDueOn.getTime()

      _publishEvent(
        new DemandeDelaiSignaled({
          payload: {
            projectId: props.projectId.toString(),
            decidedOn: decidedOn.getTime(),
            notes,
            attachments: attachment ? [attachment] : [],
            signaledBy: signaledBy.id,
            ...(status === 'acceptée'
              ? {
                  status,
                  ...(isNewDateApplicable && { oldCompletionDueOn: props.completionDueOn }),
                  newCompletionDueOn: args.newCompletionDueOn.getTime(),
                  isNewDateApplicable,
                }
              : { status }),
          },
        })
      )

      if (isNewDateApplicable) {
        _publishEvent(
          new ProjectCompletionDueDateSet({
            payload: {
              projectId: props.projectId.toString(),
              completionDueOn: args.newCompletionDueOn.getTime(),
              setBy: signaledBy.id,
            },
          })
        )
      }
      return ok(null)
    },
    signalerDemandeAbandon: function (args) {
      const { decidedOn, status, notes, attachment, signaledBy } = args
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      _publishEvent(
        new DemandeAbandonSignaled({
          payload: {
            projectId: props.projectId.toString(),
            decidedOn: decidedOn.getTime(),
            notes,
            attachments: attachment ? [attachment] : [],
            signaledBy: signaledBy.id,
            status,
          },
        })
      )

      if (status === 'acceptée' && props.abandonedOn === 0) {
        _publishEvent(
          new ProjectAbandoned({
            payload: {
              projectId: props.projectId.toString(),
              abandonAcceptedBy: signaledBy.id,
            },
            original: {
              version: 1,
              occurredAt: decidedOn,
            },
          })
        )
      }

      return ok(null)
    },
    signalerDemandeRecours: function (args) {
      const { decidedOn, status, notes, attachment, signaledBy } = args
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      if (status === 'acceptée' && !attachment) {
        return err(new AttachmentRequiredForDemandeRecoursAcceptedError())
      }

      _publishEvent(
        new DemandeRecoursSignaled({
          payload: {
            projectId: props.projectId.toString(),
            decidedOn: decidedOn.getTime(),
            notes,
            attachments: attachment ? [attachment] : [],
            signaledBy: signaledBy.id,
            status,
          },
        })
      )

      if (status === 'acceptée' && !props.isClasse) {
        this.grantClasse(signaledBy)
          .andThen(() => attachment && this.updateCertificate(signaledBy, attachment.id))
          .andThen(() => this.setNotificationDate(signaledBy, decidedOn.getTime()))
      }

      return ok(null)
    },
    addGFExpirationDate: function (args) {
      const { expirationDate, submittedBy, projectId } = args
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }
      if (!props.hasCurrentGf) {
        return err(new NoGFCertificateToUpdateError())
      }
      _publishEvent(
        new DateEchéanceGFAjoutée({
          payload: {
            expirationDate,
            submittedBy: submittedBy.id,
            projectId,
          },
        })
      )

      return ok(null)
    },
    removeUnexpectedGFDueDateforPPE2Project: function () {
      if (!props.hasProducteurChange) {
        _publishEvent(
          new ProjectGFDueDateCancelled({
            payload: {
              projectId: props.projectId.toString(),
            },
          })
        )
      }
      return ok(null)
    },
    get pendingEvents() {
      return pendingEvents
    },
    get shouldCertificateBeGenerated() {
      return (
        _isNotified() &&
        _periodeHasCertificate() &&
        !_hasPendingEventOfType(ProjectCertificateUpdated.type) &&
        (!props.lastCertificateUpdate ||
          (!!props.lastUpdatedOn && props.lastCertificateUpdate < props.lastUpdatedOn))
      )
    },
    get lastUpdatedOn() {
      return props.lastUpdatedOn
    },
    get isClasse() {
      return props.isClasse
    },
    get isLegacy() {
      return props.appelOffre && props.appelOffre.periode.type === 'legacy'
    },
    get puissanceInitiale() {
      return props.puissanceInitiale
    },
    get certificateData() {
      if (!props.appelOffre) {
        const errorMessage = `Appel d'offre inaccessible dans project.addGeneratedCertificate pour le project ${projectId}`
        return err(
          new IllegalInitialStateForAggregateError({ projectId, errorMessage })
        ) as Project['certificateData']
      }

      const { periode } = props.appelOffre
      if (!isNotifiedPeriode(periode) || !periode.certificateTemplate || !props.notifiedOn) {
        return err(new ProjectNotEligibleForCertificateError()) as Project['certificateData']
      }

      return toProjectDataForCertificate(props).map((data) => ({
        template: periode.certificateTemplate,
        data,
      }))
    },
    get certificateFilename() {
      const { appelOffre, data, potentielIdentifier } = props

      if (!appelOffre || !data || !potentielIdentifier) return 'attestation.pdf'

      const { nomProjet } = data

      return sanitize(`${potentielIdentifier}-${nomProjet}.pdf`)
    },
    get id() {
      return projectId
    },
    get data() {
      return props.data
    },
    get lastCertificateUpdate() {
      return props.lastCertificateUpdate
    },
    get newRulesOptIn() {
      return props.newRulesOptIn
    },
    get appelOffreId() {
      return props.appelOffreId
    },
    get periodeId() {
      return props.periodeId
    },
    get familleId() {
      return props.familleId
    },
    get completionDueOn() {
      return props.completionDueOn
    },
  })

  // private methods
  function _validateProjectFields(
    newProps: Partial<ProjectDataProps>
  ): Result<Partial<ProjectDataProps>, IllegalProjectStateError> {
    const errorsInFields = projectValidator(newProps)

    if ('familleId' in newProps) {
      const { appelOffreId, periodeId } = { ...props.data, ...newProps }

      if (!appelOffreId || !periodeId) {
        errorsInFields.appelOffre = "Ce projet n'est associé à aucun appel d'offre"
      } else {
        if (!getProjectAppelOffre({ appelOffreId, periodeId, familleId: newProps.familleId })) {
          // Can't find family in appelOffre
          errorsInFields.familleId = "Cette famille n'existe pas pour cet appel d'offre"
        }
      }
    }

    if (Object.keys(errorsInFields).length) {
      return err(new IllegalProjectStateError(errorsInFields))
    }

    return ok(newProps)
  }

  function _publishEvent(event: DomainEvent) {
    pendingEvents.push(event)
    _processEvent(event)
  }

  function _updateLastUpdatedOn(event: DomainEvent) {
    // only update lastUpdatedOn date for events that mutate the entity
    switch (event.type) {
      case LegacyProjectSourced.type:
      case ProjectImported.type:
      case ProjectReimported.type:
      case ProjectNotified.type:
      case ProjectNotificationDateSet.type:
      case ProjectCompletionDueDateSet.type:
      case ProjectDataCorrected.type:
      case ProjectClasseGranted.type:
      case ProjectGFSubmitted.type:
      case ProjectGFRemoved.type:
      case ProjectGFInvalidated.type:
      case ProjectGFUploaded.type:
        props.lastUpdatedOn = event.occurredAt
        break
      default:
        // ignore other event types
        break
    }
  }

  function _processEvent(event: DomainEvent) {
    switch (event.type) {
      case LegacyProjectSourced.type:
        props.data = event.payload.content
        props.notifiedOn = event.payload.content.notifiedOn
        props.puissanceInitiale = event.payload.content.puissance
        props.potentielIdentifier = event.payload.potentielIdentifier
        _updateClasse(event.payload.content.classe)
        props.appelOffreId = event.payload.appelOffreId
        props.periodeId = event.payload.periodeId
        props.familleId = event.payload.familleId
        break
      case ProjectImported.type:
        props.data = event.payload.data
        props.puissanceInitiale = event.payload.data.puissance
        props.potentielIdentifier = event.payload.potentielIdentifier
        _updateClasse(event.payload.data.classe)
        props.appelOffreId = event.payload.appelOffreId
        props.periodeId = event.payload.periodeId
        props.familleId = event.payload.familleId
        break
      case ProjectReimported.type:
        props.data = { ...props.data, ...event.payload.data }
        if (event.payload.data.puissance) {
          props.puissanceInitiale = event.payload.data.puissance
        }
        if (event.payload.data.classe) {
          _updateClasse(event.payload.data.classe)
        }
        break
      case ProjectNotified.type:
      case ProjectNotificationDateSet.type:
        props.notifiedOn = event.payload.notifiedOn
        props.fieldsUpdatedAfterImport.add('notifiedOn')
        break
      case ProjectCompletionDueDateSet.type:
      case CovidDelayGranted.type:
        if (props.completionDueOn !== 0) props.hasCompletionDueDateMoved = true
        props.completionDueOn = event.payload.completionDueOn
        break
      case ProjectDataCorrected.type:
        props.data = { ...props.data, ...event.payload.correctedData } as ProjectProps['data']
        for (const updatedField of Object.keys(event.payload.correctedData)) {
          props.fieldsUpdatedAfterImport.add(updatedField)
        }
        break
      case ProjectCertificateUpdated.type:
        props.lastCertificateUpdate = event.occurredAt
        break
      case ProjectCertificateGenerated.type:
      case ProjectCertificateRegenerated.type:
        props.lastCertificateUpdate = event.payload.projectVersionDate || event.occurredAt
        break
      case ProjectClasseGranted.type:
        props.isClasse = true
        props.data = {
          ...props.data,
          classe: 'Classé',
        } as ProjectProps['data']
        props.fieldsUpdatedAfterImport.add('classe')
        break
      case ProjectActionnaireUpdated.type:
        props.data = {
          ...props.data,
          actionnaire: event.payload.newActionnaire,
        } as ProjectProps['data']
        props.fieldsUpdatedAfterImport.add('actionnaire')
        break
      case ProjectProducteurUpdated.type:
        props.data = {
          ...props.data,
          nomCandidat: event.payload.newProducteur,
        } as ProjectProps['data']
        props.fieldsUpdatedAfterImport.add('nomCandidat')
        props.hasProducteurChange = true
        break
      case ProjectPuissanceUpdated.type:
        props.data = {
          ...props.data,
          puissance: event.payload.puissance,
        } as ProjectProps['data']
        props.fieldsUpdatedAfterImport.add('puissance')
        break
      case ProjectFournisseursUpdated.type:
        props.data = {
          ...props.data,
          details: {
            ...props.data?.details,
            ...event.payload.newFournisseurs.reduce(
              (fournisseurs, { kind, name }) => ({ ...fournisseurs, [kind]: name }),
              {}
            ),
          },
        } as ProjectProps['data']

        for (const { kind } of event.payload.newFournisseurs) {
          props.fieldsUpdatedAfterImport.add(`details.${kind}`)
        }

        break
      case ProjectGFSubmitted.type:
      case ProjectGFUploaded.type:
        props.hasCurrentGf = true
        if (event.payload.expirationDate) {
          props.GFExpirationDate = event.payload.expirationDate
        }
        break
      case ProjectGFRemoved.type:
      case ProjectGFInvalidated.type:
      case ProjectGFWithdrawn.type:
        props.hasCurrentGf = false
        break
      case ProjectAbandoned.type:
        props.abandonedOn = event.occurredAt.getTime()
        break
      case AppelOffreProjetModifié.type:
        props.appelOffreId = event.payload.appelOffreId
        props.periodeId = event.payload.periodeId
        break
      case DateEchéanceGFAjoutée.type:
        props.GFExpirationDate = event.payload.expirationDate
        break
      case IdentifiantPotentielPPE2Batiment2Corrigé.type:
        props.potentielIdentifier = event.payload.nouvelIdentifiant
      default:
        // ignore other event types
        break
    }

    _updateLastUpdatedOn(event)
  }

  function _isNew() {
    return !history
  }

  function _isNotified() {
    return !!props.notifiedOn
  }

  function _periodeHasCertificate() {
    return !!props.appelOffre?.periode.certificateTemplate
  }

  function _updateAppelOffre(args: {
    appelOffreId?: string
    periodeId?: string
    familleId?: string
  }) {
    const { appelOffre: currentAppelOffre } = props

    const appelOffreId = args.appelOffreId || currentAppelOffre?.id
    const periodeId = args.periodeId || currentAppelOffre?.periode.id
    const familleId = args.familleId || currentAppelOffre?.famille?.id

    if (!appelOffreId || !periodeId) return

    const newAppelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })
    if (!newAppelOffre) {
      props.hasError = true
    } else {
      props.appelOffre = newAppelOffre
    }
  }

  function _updateClasse(classe: string) {
    props.isClasse = classe === 'Classé'
  }

  function _allEventsHaveSameAggregateId() {
    return history
      ? history.every((event) => event.aggregateId?.includes(projectId.toString()))
      : true
  }

  function _isLegacyOrImport(event: DomainEvent): event is LegacyProjectSourced | ProjectImported {
    return event.type === LegacyProjectSourced.type || event.type === ProjectImported.type
  }

  function _removePendingEventsOfType(type: DomainEvent['type']) {
    remove(pendingEvents, (event) => event.type === type)
  }

  function _hasPendingEventOfType(type: DomainEvent['type']) {
    return pendingEvents.some((event) => event.type === type)
  }

  function _updateDCRDate(appelOffre: ProjectAppelOffre) {
    if (props.isClasse) {
      _removePendingEventsOfType(ProjectDCRDueDateSet.type)
      const notifiedOnDate = new Date(props.notifiedOn)
      const delaiDcr = appelOffre.periode.delaiDcrEnMois.valeur

      _publishEvent(
        new ProjectDCRDueDateSet({
          payload: {
            projectId: props.projectId.toString(),
            dcrDueOn: notifiedOnDate.setMonth(notifiedOnDate.getMonth() + delaiDcr),
          },
        })
      )
    }
  }

  function _cancelDCRDate() {
    _publishEvent(
      new ProjectDCRDueDateCancelled({
        payload: {
          projectId: props.projectId.toString(),
        },
      })
    )
  }

  function _updateCompletionDate(
    appelOffre: ProjectAppelOffre,
    forceValue?: { setBy?: string; completionDueOn: number }
  ) {
    if (!props.isClasse) return

    if (props.hasCompletionDueDateMoved && !forceValue) return

    if (!props.notifiedOn) return

    const { setBy, completionDueOn } = forceValue || {}
    _removePendingEventsOfType(ProjectCompletionDueDateSet.type)
    _publishEvent(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId: props.projectId.toString(),
          completionDueOn:
            completionDueOn ||
            moment(props.notifiedOn)
              .add(getDelaiDeRealisation(appelOffre, props.data?.technologie ?? 'N/A'), 'months')
              .subtract(1, 'day')
              .toDate()
              .getTime(),
          setBy: setBy || '',
        },
      })
    )
  }

  function _cancelCompletionDate() {
    _publishEvent(
      new ProjectCompletionDueDateCancelled({
        payload: {
          projectId: props.projectId.toString(),
        },
      })
    )
  }

  function _updateGFDate(appelOffre: ProjectAppelOffre) {
    const { isClasse } = props
    if (isClasse && appelOffre.isSoumisAuxGFs) {
      _removePendingEventsOfType(ProjectGFDueDateSet.type)
      _publishEvent(
        new ProjectGFDueDateSet({
          payload: {
            projectId: props.projectId.toString(),
            garantiesFinancieresDueOn: moment(props.notifiedOn).add(2, 'months').toDate().getTime(),
          },
        })
      )
    }
  }

  function _cancelGFDate(appelOffre: ProjectAppelOffre) {
    if (appelOffre.isSoumisAuxGFs) {
      _publishEvent(
        new ProjectGFDueDateCancelled({
          payload: {
            projectId: props.projectId.toString(),
          },
        })
      )
    }
  }

  function _computeDelta(data) {
    const mainChanges = !!data && shallowDelta(props.data || {}, { ...data, details: undefined })

    const changes = { ...mainChanges } as Partial<ProjectDataProps>

    const detailsChanges = !!data?.details && shallowDelta(props.data?.details || {}, data.details)

    if (detailsChanges) {
      changes.details = detailsChanges
    }

    for (const key of Object.keys(changes)) {
      if (typeof changes[key] === 'undefined') {
        delete changes[key]
      }
    }

    return changes
  }

  function _publishNewNotificationDate(payload: ProjectNotificationDateSet['payload']) {
    _publishEvent(
      new ProjectNotificationDateSet({
        payload,
      })
    )
  }
}
