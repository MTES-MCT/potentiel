import moment from 'moment-timezone'
import sanitize from 'sanitize-filename'
import { UniqueEntityID } from '../../core/domain'
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
import { StoredEvent } from '../eventStore'
import { EventStoreAggregate } from '../eventStore/EventStoreAggregate'
import {
  EntityNotFoundError,
  HeterogeneousHistoryError,
  IllegalInitialStateForAggregateError,
  IncompleteDataError,
} from '../shared'
import { ProjectDataForCertificate } from './dtos'
import {
  IllegalProjectDataError,
  ProjectAlreadyNotifiedError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  ProjectNotEligibleForCertificateError,
} from './errors'
import {
  LegacyProjectSourced,
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectCertificateUploaded,
  ProjectClasseGranted,
  ProjectDataCorrected,
  ProjectDataCorrectedPayload,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectImported,
  ProjectNotificationDateSet,
  ProjectNotified,
  ProjectReimported,
} from './events'
import { toProjectDataForCertificate } from './mappers'

export interface Project extends EventStoreAggregate {
  notify: (
    notifiedOn: number
  ) => Result<null, IllegalProjectDataError | ProjectAlreadyNotifiedError>
  correctData: (
    user: User,
    data: ProjectDataCorrectedPayload['correctedData']
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>
  setNotificationDate: (
    user: User,
    notifiedOn: number
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError>
  uploadCertificate: (
    user: User,
    certificateFileId: string
  ) => Result<null, ProjectCannotBeUpdatedIfUnnotifiedError>
  grantClasse: (user: User) => Result<null, never>
  addGeneratedCertificate: (args: {
    projectVersionDate: Date
    certificateFileId: string
  }) => Result<null, never>
  readonly shouldCertificateBeGenerated: boolean
  readonly appelOffre: ProjectAppelOffre
  readonly isClasse: boolean
  readonly certificateData: Result<
    {
      template: CertificateTemplate
      data: ProjectDataForCertificate
    },
    IncompleteDataError | ProjectNotEligibleForCertificateError
  >
  readonly certificateFilename: string
  readonly data: ProjectDataProps | undefined
  readonly lastCertificateUpdate: Date | undefined
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
}

export interface ProjectProps {
  projectId: UniqueEntityID
  appelOffre: ProjectAppelOffre
  notifiedOn: number
  lastUpdatedOn: Date
  lastCertificateUpdate: Date | undefined
  hasError: boolean
  isClasse: boolean
  data: ProjectDataProps | undefined
}

const projectValidator = makePropertyValidator({
  puissance: isStrictlyPositiveNumber,
  prixReference: isPositiveNumber,
  note: isPositiveNumber,
  evaluationCarbone: isPositiveNumber,
})

export const makeProject = (args: {
  projectId: UniqueEntityID
  history: StoredEvent[]
  appelsOffres: Record<AppelOffre['id'], AppelOffre>
}): Result<Project, EntityNotFoundError | HeterogeneousHistoryError> => {
  const { history, projectId, appelsOffres } = args

  if (!history || !history.length) {
    return err(new EntityNotFoundError())
  }

  if (!_allEventsHaveSameAggregateId()) {
    return err(new HeterogeneousHistoryError())
  }

  const initialAppelOffre = _getInitialAppelOffreFromHistory()
  if (!initialAppelOffre) {
    return err(new IllegalInitialStateForAggregateError())
  }

  const initialClasse = _getInitialClasse()
  if (initialClasse === null) {
    return err(new IllegalInitialStateForAggregateError())
  }

  const pendingEvents: StoredEvent[] = []
  const props: ProjectProps = {
    notifiedOn: 0,
    projectId,
    appelOffre: initialAppelOffre,
    isClasse: initialClasse,
    data: undefined,
    hasError: false,
    lastUpdatedOn: history[0].occurredAt,
    lastCertificateUpdate: undefined,
  }

  // Initialize aggregate by processing each event in history
  for (const event of history) {
    _processEvent(event)

    if (props.hasError) {
      return err(new IllegalInitialStateForAggregateError())
    }
  }

  // public methods
  return ok({
    notify: function (notifiedOn) {
      const { appelOffre, data, projectId } = props

      if (props.notifiedOn) {
        return err(new ProjectAlreadyNotifiedError())
      }

      if (!data || !data.email) {
        return err(new IllegalProjectDataError({ email: "le projet n'a pas d'email de contact" }))
      }

      _publishEvent(
        new ProjectNotified({
          payload: {
            projectId: projectId.toString(),
            appelOffreId: appelOffre.id,
            periodeId: appelOffre.periode.id,
            familleId: appelOffre.famille?.id,
            candidateEmail: data.email,
            candidateName: data.nomRepresentantLegal || '',
            notifiedOn,
          },
        })
      )

      _updateDCRDate()
      _updateGFDate()

      return ok(null)
    },
    correctData: function (user, corrections) {
      if (!_isNotified() || !props.data) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      // Compute delta with what has changed
      const delta = Object.entries(corrections).reduce(
        (modifiedData, [correctionKey, correctionValue]) => {
          // If the specific property is missing from props.data
          // or it's value has changed, add it to the delta
          if (
            typeof correctionValue !== 'undefined' &&
            props.data &&
            (typeof props.data[correctionKey] === 'undefined' ||
              props.data[correctionKey] !== correctionValue)
          ) {
            modifiedData[correctionKey] = correctionValue
          }

          return modifiedData
        },
        {}
      ) as Partial<ProjectDataProps>

      if (!delta || !Object.keys(delta).length) {
        return ok(null)
      }

      return _validateProjectFields(delta).andThen(() => {
        _publishEvent(
          new ProjectDataCorrected({
            payload: {
              projectId: props.projectId.toString(),
              correctedBy: user.id,
              correctedData: delta,
            },
          })
        )
        return ok(null)
      })
    },
    setNotificationDate: function (user, notifiedOn) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      try {
        isStrictlyPositiveNumber(notifiedOn)
      } catch (e) {
        return err(new IllegalProjectDataError({ notifiedOn: e.message }))
      }

      // If it's the same day, ignore small differences in timestamp
      if (moment(notifiedOn).tz('Europe/Paris').isSame(props.notifiedOn, 'day')) return ok(null)

      _publishEvent(
        new ProjectNotificationDateSet({
          payload: {
            projectId: props.projectId.toString(),
            notifiedOn,
            setBy: user.id,
          },
        })
      )

      _updateDCRDate()
      _updateGFDate()

      return ok(null)
    },
    uploadCertificate: function (user, certificateFileId) {
      if (!_isNotified()) {
        return err(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      _publishEvent(
        new ProjectCertificateUploaded({
          payload: {
            projectId: props.projectId.toString(),
            certificateFileId,
            uploadedBy: user.id,
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
    addGeneratedCertificate: function ({ projectVersionDate, certificateFileId }) {
      if (props.lastCertificateUpdate) {
        _publishEvent(
          new ProjectCertificateRegenerated({
            payload: {
              projectId: props.projectId.toString(),
              projectVersionDate,
              certificateFileId,
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
        (!props.lastCertificateUpdate || props.lastCertificateUpdate < props.lastUpdatedOn)
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
    get certificateData() {
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
      if (!props.data) return 'attestation.pdf'

      const { appelOffre, data, projectId } = props
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
  })

  // private methods
  function _validateProjectFields(
    newProps: Partial<ProjectDataProps>
  ): Result<Partial<ProjectDataProps>, IllegalProjectDataError> {
    const errorsInFields = projectValidator(newProps)

    if ('familleId' in newProps) {
      const { appelOffreId, periodeId } = { ...props.data, ...newProps }
      if (!_getAppelOffreById(appelOffreId, periodeId, newProps.familleId)) {
        // Can't find family in appelOffre
        errorsInFields.familleId = "Cette famille n'existe pas pour cet appel d'offre"
      }
    }

    if (Object.keys(errorsInFields).length) {
      return err(new IllegalProjectDataError(errorsInFields))
    }

    return ok(newProps)
  }

  function _publishEvent(event: StoredEvent) {
    pendingEvents.push(event)
    _processEvent(event)
  }

  function _updateLastUpdatedOn(event: StoredEvent) {
    // only update lastUpdatedOn date for events that mutate the entity
    switch (event.type) {
      case LegacyProjectSourced.type:
      case ProjectImported.type:
      case ProjectReimported.type:
      case ProjectNotified.type:
      case ProjectNotificationDateSet.type:
      case ProjectDataCorrected.type:
      case ProjectClasseGranted.type:
        props.lastUpdatedOn = event.occurredAt
        break
      default:
        // ignore other event types
        break
    }
  }

  function _processEvent(event: StoredEvent) {
    switch (event.type) {
      case LegacyProjectSourced.type:
        props.data = event.payload.content
        props.notifiedOn = event.payload.content.notifiedOn
        _updateClasse(event.payload.content.classe)
        _updateAppelOffre(event.payload)
        break
      case ProjectImported.type:
        props.data = event.payload.data
        _updateClasse(event.payload.data.classe)
        _updateAppelOffre(event.payload)
        break
      case ProjectReimported.type:
        props.data = event.payload.data
        _updateClasse(event.payload.data.classe)
        _updateAppelOffre(event.payload.data)
        break
      case ProjectNotified.type:
      case ProjectNotificationDateSet.type:
        props.notifiedOn = event.payload.notifiedOn
        break
      case ProjectDataCorrected.type:
        props.data = { ...props.data, ...event.payload.correctedData } as ProjectProps['data']
        _updateAppelOffre(event.payload.correctedData)
        break
      case ProjectCertificateUploaded.type:
        props.lastCertificateUpdate = event.occurredAt
        break
      case ProjectCertificateGenerated.type:
      case ProjectCertificateRegenerated.type:
        props.lastCertificateUpdate = event.payload.projectVersionDate || event.occurredAt
        break
      case ProjectClasseGranted.type:
        props.isClasse = true
        break
      default:
        // ignore other event types
        break
    }

    _updateLastUpdatedOn(event)
  }

  function _isNotified() {
    return !!props.notifiedOn
  }

  function _periodeHasCertificate() {
    return !!props.appelOffre.periode.isNotifiedOnPotentiel
  }

  function _updateAppelOffre(args: {
    appelOffreId?: string
    periodeId?: string
    familleId?: string
  }) {
    const { appelOffre: currentAppelOffre } = props

    const appelOffreId = args.appelOffreId || currentAppelOffre.id
    const periodeId = args.periodeId || currentAppelOffre.periode.id
    const familleId = args.familleId || currentAppelOffre.famille?.id

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
    appelOffreId,
    periodeId,
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
    return history.every((event) => event.aggregateId.includes(projectId.toString()))
  }

  function _isLegacyOrImport(event: StoredEvent): event is LegacyProjectSourced | ProjectImported {
    return event.type === LegacyProjectSourced.type || event.type === ProjectImported.type
  }

  function _getInitialAppelOffreFromHistory(): ProjectAppelOffre | null {
    const foundingEvent = history.find(_isLegacyOrImport)
    if (!foundingEvent) return null

    return _getAppelOffreById(foundingEvent.payload.appelOffreId, foundingEvent.payload.periodeId)
  }

  function _getInitialClasse(): boolean | null {
    const foundingEvent = history.find(_isLegacyOrImport)
    if (!foundingEvent) return null

    const classe =
      foundingEvent.type === LegacyProjectSourced.type
        ? foundingEvent.payload.content.classe
        : foundingEvent.payload.data.classe

    if (classe === 'Classé') return true
    else if (classe === 'Eliminé') return false

    return null
  }

  function _updateDCRDate() {
    if (props.isClasse) {
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

  function _shouldSubmitGF() {
    return (
      props.isClasse &&
      (!!props.appelOffre.famille?.soumisAuxGarantiesFinancieres ||
        props.appelOffre.id === 'Eolien')
    )
  }

  function _updateGFDate() {
    if (_shouldSubmitGF()) {
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
}
