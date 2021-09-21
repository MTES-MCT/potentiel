import moment from 'moment-timezone'
import sanitize from 'sanitize-filename'
import _ from 'lodash'
import { DomainEvent, UniqueEntityID } from '../../core/domain'
import {
  err,
  isPositiveNumber,
  isStrictlyPositiveNumber,
  makePropertyValidator,
  ok,
  Result,
} from '../../core/utils'
import {
  AppelOffre,
  CertificateTemplate,
  makeProjectIdentifier,
  ProjectAppelOffre,
  User,
} from '../../entities'
import { EventStoreAggregate } from '../eventStore'
import {
  EntityNotFoundError,
  HeterogeneousHistoryError,
  IllegalInitialStateForAggregateError,
  IncompleteDataError,
} from '../shared'
import { ProjectDataForCertificate } from './dtos'
import {
  EliminatedProjectCannotBeAbandonnedError,
  IllegalProjectStateError,
  ProjectAlreadyNotifiedError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  ProjectNotEligibleForCertificateError,
} from './errors'
import {
  LegacyProjectSourced,
  ProjectProducteurUpdated,
  ProjectAbandoned,
  ProjectActionnaireUpdated,
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
  ProjectClasseGranted,
  ProjectCompletionDueDateSet,
  ProjectDataCorrected,
  ProjectDataCorrectedPayload,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectImported,
  ProjectNotificationDateSet,
  ProjectNotified,
  ProjectPuissanceUpdated,
  ProjectReimported,
  ProjectFournisseursUpdated,
  ProjectReimportedPayload,
  ProjectImportedPayload,
} from './events'
import { toProjectDataForCertificate } from './mappers'
import { Fournisseur } from '.'

export interface Project extends EventStoreAggregate {
  notify: (
    notifiedOn: number
  ) => Result<null, IllegalProjectStateError | ProjectAlreadyNotifiedError>
  abandon: (user: User) => Result<null, EliminatedProjectCannotBeAbandonnedError>
  reimport: (args: {
    data: ProjectReimportedPayload['data']
    importId: string
  }) => Result<null, never>
  import: (args: { data: ProjectImportedPayload['data']; importId: string }) => Result<null, never>
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
  readonly shouldCertificateBeGenerated: boolean
  readonly appelOffre?: ProjectAppelOffre
  readonly isClasse?: boolean
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
}

export interface ProjectProps {
  projectId: UniqueEntityID
  appelOffre?: ProjectAppelOffre
  notifiedOn: number
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
  appelsOffres: Record<AppelOffre['id'], AppelOffre>
}): Result<Project, EntityNotFoundError | HeterogeneousHistoryError> => {
  const { history, projectId, appelsOffres } = args

  if (!_allEventsHaveSameAggregateId()) {
    return err(new HeterogeneousHistoryError())
  }

  const pendingEvents: DomainEvent[] = []
  const props: ProjectProps = {
    notifiedOn: 0,
    completionDueOn: 0,
    hasCompletionDueDateMoved: false,
    projectId,
    puissanceInitiale: 0,
    data: undefined,
    hasError: false,
    lastCertificateUpdate: undefined,
    newRulesOptIn: false,
    fieldsUpdatedAfterImport: new Set<string>(),
  }

  // Initialize aggregate by processing each event in history
  if (history) {
    if (history.length === 0) {
      return err(new EntityNotFoundError())
    }

    for (const event of history) {
      _processEvent(event)

      if (props.hasError) {
        return err(new IllegalInitialStateForAggregateError())
      }
    }
  }

  // public methods
  return ok({
    notify: function (notifiedOn) {
      const { appelOffre, data, projectId } = props

      if (!appelOffre) {
        return err(new IllegalInitialStateForAggregateError())
      }

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

      _updateDCRDate()
      _updateGFDate()
      _updateCompletionDate()

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
    reimport: function ({ data, importId }) {
      const changes = _computeDelta(data)

      for (const updatedField of props.fieldsUpdatedAfterImport) {
        if (updatedField.startsWith('details.') && changes.details) {
          delete changes.details[updatedField.substring('details.'.length)]
          continue
        }
        delete changes[updatedField]
      }

      if (!changes || !Object.keys(changes).length) {
        return ok(null)
      }

      _publishEvent(
        new ProjectReimported({
          payload: {
            projectId: props.projectId.toString(),
            importId,
            data: changes,
          },
        })
      )

      return ok(null)
    },
    import: function ({ data, importId }) {
      const { appelOffreId, periodeId, familleId, numeroCRE } = data
      _publishEvent(
        new ProjectImported({
          payload: {
            projectId: projectId.toString(),
            appelOffreId,
            periodeId,
            familleId,
            numeroCRE,
            importId,
            data,
          },
        })
      )

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
    moveCompletionDueDate: function (user, delayInMonths) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      const newCompletionDueOn = moment(props.completionDueOn)
        .add(delayInMonths, 'months')
        .toDate()
        .getTime()

      if (newCompletionDueOn <= props.notifiedOn) {
        return err(
          new IllegalProjectStateError({
            completionDueOn:
              'La nouvelle date de mise en service doit postérieure à la date de notification.',
          })
        )
      }

      _updateCompletionDate({ setBy: user.id, completionDueOn: newCompletionDueOn })

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

      _publishEvent(
        new ProjectNotificationDateSet({
          payload: {
            projectId: props.projectId.toString(),
            notifiedOn,
            setBy: user?.id || '',
          },
        })
      )

      _updateDCRDate()
      _updateGFDate()
      _updateCompletionDate()

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
        return err(new IllegalInitialStateForAggregateError())
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
    get appelOffre() {
      return props.appelOffre
    },
    get lastUpdatedOn() {
      return props.lastUpdatedOn
    },
    get isClasse() {
      return props.isClasse
    },
    get puissanceInitiale() {
      return props.puissanceInitiale
    },
    get certificateData() {
      if (!props.appelOffre) {
        return err(new IllegalInitialStateForAggregateError()) as Project['certificateData']
      }

      const { periode } = props.appelOffre
      if (!periode.isNotifiedOnPotentiel || !periode.certificateTemplate || !props.notifiedOn) {
        return err(new ProjectNotEligibleForCertificateError()) as Project['certificateData']
      }

      return toProjectDataForCertificate(props).map((data) => ({
        template: periode.certificateTemplate,
        data,
      }))
    },
    get certificateFilename() {
      const { appelOffre, data, projectId } = props

      if (!appelOffre || !data) return 'attestation.pdf'

      const { familleId, numeroCRE, nomProjet } = data

      const potentielId = makeProjectIdentifier({
        appelOffreId: appelOffre.id,
        periodeId: appelOffre.periode.id,
        familleId,
        id: projectId.toString(),
        numeroCRE,
      })

      return sanitize(`${potentielId}-${nomProjet}.pdf`)
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
        if (!_getAppelOffreById(appelOffreId, periodeId, newProps.familleId)) {
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
        _updateClasse(event.payload.content.classe)
        _updateAppelOffre(event.payload)
        break
      case ProjectImported.type:
        props.data = event.payload.data
        props.puissanceInitiale = event.payload.data.puissance
        _updateClasse(event.payload.data.classe)
        _updateAppelOffre(event.payload)
        break
      case ProjectReimported.type:
        props.data = { ...props.data, ...event.payload.data }
        if (event.payload.data.puissance) {
          props.puissanceInitiale = event.payload.data.puissance
        }
        if (event.payload.data.classe) {
          _updateClasse(event.payload.data.classe)
        }
        _updateAppelOffre(event.payload.data)
        break
      case ProjectNotified.type:
      case ProjectNotificationDateSet.type:
        props.notifiedOn = event.payload.notifiedOn
        props.fieldsUpdatedAfterImport.add('notifiedOn')
        break
      case ProjectCompletionDueDateSet.type:
        if (props.completionDueOn !== 0) props.hasCompletionDueDateMoved = true
        props.completionDueOn = event.payload.completionDueOn
        break
      case ProjectDataCorrected.type:
        props.data = { ...props.data, ...event.payload.correctedData } as ProjectProps['data']
        for (const updatedField of Object.keys(event.payload.correctedData)) {
          props.fieldsUpdatedAfterImport.add(updatedField)
        }
        _updateAppelOffre(event.payload.correctedData)
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
    return !!props.appelOffre?.periode.isNotifiedOnPotentiel
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

    const newAppelOffre = _getAppelOffreById(appelOffreId, periodeId, familleId)

    if (!newAppelOffre) {
      props.hasError = true
    } else {
      props.appelOffre = newAppelOffre
    }
  }

  function _updateClasse(classe: string) {
    props.isClasse = classe === 'Classé'
  }

  function _getAppelOffreById(
    appelOffreId: string,
    periodeId: string,
    familleId?: string
  ): ProjectAppelOffre | null {
    const appelOffre = appelsOffres[appelOffreId]

    if (!appelOffre) return null

    const periode = appelOffre.periodes.find((periode) => periode.id === periodeId)

    if (!periode) return null

    let famille
    if (familleId) {
      famille = appelOffre.familles.find((famille) => famille.id === familleId)

      if (!famille) return null
    }

    return { ...appelOffre, periode, famille } as ProjectAppelOffre
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
    _.remove(pendingEvents, (event) => event.type === type)
  }

  function _hasPendingEventOfType(type: DomainEvent['type']) {
    return pendingEvents.some((event) => event.type === type)
  }

  function _updateDCRDate() {
    if (props.isClasse) {
      _removePendingEventsOfType(ProjectDCRDueDateSet.type)
      _publishEvent(
        new ProjectDCRDueDateSet({
          payload: {
            projectId: props.projectId.toString(),
            dcrDueOn: moment(props.notifiedOn).add(2, 'months').toDate().getTime(),
          },
        })
      )
    }
  }

  function _updateCompletionDate(forceValue?: { setBy: string; completionDueOn: number }) {
    if (!props.isClasse) return

    if (props.hasCompletionDueDateMoved && !forceValue) return

    if (!props.appelOffre) return

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
              .add(props.appelOffre.delaiRealisationEnMois, 'months')
              .toDate()
              .getTime(),
          setBy,
        },
      })
    )
  }

  function _shouldSubmitGF() {
    return (
      props.isClasse &&
      (!!props.appelOffre?.famille?.soumisAuxGarantiesFinancieres ||
        props.appelOffre?.id === 'Eolien')
    )
  }

  function _updateGFDate() {
    if (_shouldSubmitGF()) {
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

  function _computeDelta(data) {
    const mainChanges = !!data && _lowLevelDelta(props.data || {}, { ...data, details: undefined })

    const changes = { ...mainChanges } as Partial<ProjectDataProps>

    const detailsChanges =
      !!data?.details && _lowLevelDelta(props.data?.details || {}, data.details)

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

  function _lowLevelDelta(previousData, newData) {
    const changes = Object.entries(newData).reduce((delta, [correctionKey, correctionValue]) => {
      // If the specific property is missing from previousData
      // or it's value has changed, add it to the delta
      if (_isValueChanged(correctionKey, correctionValue, previousData)) {
        delta[correctionKey] = correctionValue
      }

      return delta
    }, {})

    return Object.keys(changes).length ? changes : undefined
  }

  function _isValueChanged(key, newValue, data) {
    return (
      typeof newValue !== 'undefined' &&
      data &&
      (typeof data[key] === 'undefined' || data[key] !== newValue)
    )
  }
}
