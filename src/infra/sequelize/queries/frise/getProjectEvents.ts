import { getProjectAppelOffre } from '@config/queries.config'
import { ResultAsync, wrapInfra } from '@core/utils'
import {
  GarantiesFinancièresDTO,
  GetProjectEvents,
  ProjectEventDTO,
  ProjectStatus,
} from '@modules/frise'
import { userIs, userIsNot } from '@modules/users'
import { InfraNotAvailableError } from '@modules/shared'
import routes from '../../../../routes'
import { models } from '../../models'
import { is, isKnownProjectEvent, KnownProjectEvents, ProjectEvent } from '../../projectionsNext'
import { User } from '@entities'
import { GarantiesFinancièresEvent } from '../../projectionsNext/projectEvents/events/GarantiesFinancièresEvent'

const { Project } = models

const computeDueStatut = ({ dateLimiteDEnvoi, now }: { dateLimiteDEnvoi: number; now: number }) =>
  dateLimiteDEnvoi < now ? 'past-due' : 'due'

const getGarantiesFinancières = ({
  garantiesFinancièresEvent,
  isSoumisAuxGF,
  isGarantiesFinancieresDeposeesALaCandidature,
  projectStatus,
  user,
  now = Date.now(),
}: {
  garantiesFinancièresEvent?: GarantiesFinancièresEvent
  isSoumisAuxGF?: boolean
  isGarantiesFinancieresDeposeesALaCandidature: boolean
  projectStatus: string
  user: User
  now?: number
}): GarantiesFinancièresDTO | undefined => {
  if (!userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) return
  if (!isSoumisAuxGF || projectStatus === 'Eliminé') return

  if (!garantiesFinancièresEvent) {
    if (!isGarantiesFinancieresDeposeesALaCandidature || projectStatus === 'Abandonné') return
    return {
      type: 'garanties-financieres',
      variant: user.role,
      statut: 'submitted-with-application',
      date: 0,
    }
  }

  const { payload, eventPublishedAt } = garantiesFinancièresEvent
  const { dateLimiteDEnvoi } = payload

  return {
    type: 'garanties-financieres',
    statut:
      payload.statut === 'due'
        ? computeDueStatut({ dateLimiteDEnvoi: payload.dateLimiteDEnvoi, now })
        : payload.statut,
    date: payload.statut === 'due' ? dateLimiteDEnvoi : eventPublishedAt,
    variant: user.role,
    ...(payload.statut !== 'due' && {
      url: routes.DOWNLOAD_PROJECT_FILE(payload.fichier.id, payload.fichier.name),
    }),
    ...('dateExpiration' in payload && { dateExpiration: payload.dateExpiration }),
    ...('initiéParRole' in payload && {
      initiéParRole: payload.initiéParRole,
    }),
  } as GarantiesFinancièresDTO
}

export const getProjectEvents: GetProjectEvents = ({ projectId, user }) => {
  return wrapInfra(Project.findByPk(projectId))
    .andThen((rawProject: any) =>
      getEvents(projectId).map((rawEvents) => ({ rawProject, rawEvents }))
    )
    .map(async ({ rawProject, rawEvents }) => {
      const {
        email,
        nomProjet,
        potentielIdentifier,
        classe,
        abandonedOn,
        appelOffreId,
        periodeId,
        familleId,
      } = rawProject.get()
      const status: ProjectStatus = abandonedOn ? 'Abandonné' : classe
      const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

      const isGarantiesFinancieresDeposeesALaCandidature =
        appelOffre?.famille?.soumisAuxGarantiesFinancieres === 'à la candidature' ||
        appelOffre?.soumisAuxGarantiesFinancieres === 'à la candidature'

      const garantieFinanciereEnMois =
        appelOffre?.famille?.soumisAuxGarantiesFinancieres === 'après candidature'
          ? appelOffre.famille.garantieFinanciereEnMois
          : appelOffre?.soumisAuxGarantiesFinancieres === 'après candidature'
          ? appelOffre?.garantieFinanciereEnMois
          : undefined

      const garantiesFinancièresEvent = rawEvents.find(
        (event) => event.type === 'GarantiesFinancières'
      )

      return {
        project: {
          id: projectId,
          status,
          ...(garantieFinanciereEnMois && {
            garantieFinanciereEnMois,
          }),
        },
        garantiesFinancières:
          !garantiesFinancièresEvent || is('GarantiesFinancières')(garantiesFinancièresEvent)
            ? getGarantiesFinancières({
                user,
                projectStatus: status,
                isGarantiesFinancieresDeposeesALaCandidature,
                isSoumisAuxGF: appelOffre?.isSoumisAuxGF,
                garantiesFinancièresEvent,
              })
            : undefined,
        events: await rawEvents.reduce<Promise<ProjectEventDTO[]>>(
          async (eventsPromise, projectEvent) => {
            const { type, valueDate, payload, id } = projectEvent
            const events: ProjectEventDTO[] = await eventsPromise

            switch (type) {
              case 'ProjectImported':
                if (userIs(['admin', 'dgec-validateur'])(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                  })
                }
                if (userIsNot('ademe')(user) && payload.notifiedOn > 0) {
                  events.push({
                    type: 'ProjectNotified',
                    date: payload.notifiedOn,
                    variant: user.role,
                    isLegacy: true,
                  })
                }
                break
              case 'ProjectNotified':
              case 'ProjectNotificationDateSet':
              case 'CovidDelayGranted':
                if (userIsNot('ademe')(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                  })
                }
                break
              case 'ProjectClaimed':
                if (userIsNot(['ademe'])(user)) {
                  events.push({
                    type,
                    potentielIdentifier,
                    email: userIs(['admin', 'dgec-validateur'])(user) ? email : undefined,
                    nomProjet,
                    date: valueDate,
                    variant: user.role,
                    certificateFileId: payload.attestationDesignationFileId,
                    claimedBy: payload.claimedBy,
                  })
                }
                break
              case 'ProjectCertificateGenerated':
              case 'ProjectCertificateRegenerated':
              case 'ProjectCertificateUpdated':
                if (userIsNot(['ademe'])(user)) {
                  events.push({
                    type,
                    potentielIdentifier,
                    email: userIs(['admin', 'dgec-validateur'])(user) ? email : undefined,
                    nomProjet,
                    date: valueDate,
                    variant: user.role,
                    certificateFileId: payload.certificateFileId,
                  })
                }
                break
              case 'ProjectDCRSubmitted':
                if (userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) {
                  const { file } = payload
                  if (type === 'ProjectDCRSubmitted') {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      file: file && { id: file.id, name: file.name },
                      numeroDossier: payload.numeroDossier,
                    })
                  }
                }
                break
              case 'ProjectPTFSubmitted':
                if (userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) {
                  const { file } = payload
                  if (type === 'ProjectPTFSubmitted') {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      file: file && { id: file.id, name: file.name },
                    })
                  }
                }
                break
              case 'ProjectDCRRemoved':
              case 'ProjectPTFRemoved':
                if (userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                  })
                }
                break

              case 'ProjectDCRDueDateSet':
              case 'ProjectCompletionDueDateSet':
                if (userIsNot('ademe')(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                  })
                }
                break
              case 'ModificationRequested':
                if (userIsNot('ademe')(user)) {
                  const { modificationType } = payload

                  switch (modificationType) {
                    case 'delai':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        delayInMonths: payload.delayInMonths,
                        authority: payload.authority,
                      })
                      break
                    case 'puissance':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        puissance: payload.puissance,
                        unitePuissance: appelOffre?.unitePuissance,
                        authority: payload.authority,
                      })
                      break
                    case 'recours':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        authority: payload.authority,
                      })
                      break
                  }
                }
                break
              case 'ModificationRequestAccepted':
                if (userIsNot('ademe')(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                    modificationRequestId: payload.modificationRequestId,
                    file: payload.file,
                    ...(payload.delayInMonthsGranted && {
                      delayInMonthsGranted: payload.delayInMonthsGranted,
                    }),
                  })
                }
                break
              case 'ModificationRequestRejected':
                if (userIsNot('ademe')(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                    modificationRequestId: payload.modificationRequestId,
                    file: payload.file,
                  })
                }
                break
              case 'ModificationRequestCancelled':
              case 'ModificationRequestInstructionStarted':
                if (userIsNot('ademe')(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                    modificationRequestId: payload.modificationRequestId,
                  })
                }
                break
              case 'ModificationReceived':
                if (userIsNot('ademe')(user)) {
                  const { modificationType } = payload

                  switch (modificationType) {
                    case 'actionnaire':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        actionnaire: payload.actionnaire,
                      })
                      break
                    case 'fournisseur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        fournisseurs: payload.fournisseurs,
                      })
                      break
                    case 'producteur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        producteur: payload.producteur,
                      })
                      break
                    case 'puissance':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        puissance: payload.puissance,
                        unitePuissance: appelOffre?.unitePuissance,
                      })
                      break
                  }
                }
                break
              case 'LegacyModificationImported':
                if (userIsNot('ademe')(user)) {
                  const modificationType = payload.modificationType
                  const status = payload.status

                  switch (modificationType) {
                    case 'abandon':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                      })
                      break
                    case 'autre':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                        column: payload.column,
                        value: payload.value,
                      })
                      break
                    case 'actionnaire':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                        actionnairePrecedent: payload.actionnairePrecedent,
                      })
                      break
                    case 'delai':
                      if (status === 'acceptée') {
                        events.push({
                          type,
                          date: valueDate,
                          variant: user.role,
                          status,
                          filename: payload.filename,
                          modificationType,
                          ancienneDateLimiteAchevement: payload.ancienneDateLimiteAchevement,
                          nouvelleDateLimiteAchevement: payload.nouvelleDateLimiteAchevement,
                        })
                      }
                      break
                    case 'producteur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                        producteurPrecedent: payload.producteurPrecedent,
                      })
                      break
                    case 'recours':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                        motifElimination: payload.motifElimination,
                      })
                      break
                  }
                }
                break
              case 'FileAttachedToProject':
                if (userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) {
                  const { title, description, files, attachedBy, attachmentId } = payload
                  events.push({
                    type: 'FileAttachedToProject',
                    date: valueDate,
                    variant: user.role,
                    title,
                    description,
                    files,
                    isOwner: attachedBy.id === user.id,
                    attachedBy,
                    attachmentId,
                    projectId,
                  })
                }
                break
              case 'LegacyModificationFileAttached':
                const { fileId, filename } = payload
                events.push({
                  type: 'LegacyModificationFileAttached',
                  variant: user.role,
                  file: {
                    id: fileId,
                    name: filename,
                  },
                })
                break

              case 'DemandeDelaiSignaled':
                if (userIsNot('ademe')(user)) {
                  const {
                    signaledBy,
                    status,
                    oldCompletionDueOn,
                    newCompletionDueOn,
                    attachment,
                    notes,
                  } = payload
                  events.push({
                    type,
                    variant: user.role,
                    date: valueDate,
                    signaledBy,
                    ...(status === 'acceptée'
                      ? {
                          status,
                          oldCompletionDueOn,
                          newCompletionDueOn,
                        }
                      : { status }),
                    ...(userIs(['admin', 'dgec-validateur', 'dreal'])(user) && { notes }),
                    attachment,
                  })
                }
                break

              case 'DemandeAbandonSignaled':
              case 'DemandeRecoursSignaled':
                if (userIsNot('ademe')(user)) {
                  const { signaledBy, status, attachment, notes } = payload
                  events.push({
                    type,
                    variant: user.role,
                    date: valueDate,
                    signaledBy,
                    status,
                    ...(userIs(['admin', 'dgec-validateur', 'dreal'])(user) && { notes }),
                    attachment,
                  })
                }
                break

              case 'DemandeDélai':
                if (userIsNot('ademe')(user)) {
                  const { statut, autorité } = payload
                  if (payload.dateAchèvementDemandée) {
                    const { dateAchèvementDemandée } = payload
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      dateAchèvementDemandée,
                      ...(statut === 'accordée'
                        ? {
                            statut,
                            dateAchèvementAccordée: payload.dateAchèvementAccordée,
                            ancienneDateThéoriqueAchèvement:
                              payload.ancienneDateThéoriqueAchèvement,
                          }
                        : { statut }),
                      ...((userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) ||
                        (userIs('dreal') && autorité === 'dreal')) && {
                        demandeUrl: routes.DEMANDE_PAGE_DETAILS(id),
                      }),
                    })
                  }

                  if (payload.délaiEnMoisDemandé) {
                    const { délaiEnMoisDemandé } = payload
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      délaiEnMoisDemandé,
                      ...(statut === 'accordée'
                        ? {
                            statut,
                            délaiEnMoisAccordé: payload.délaiEnMoisAccordé,
                          }
                        : { statut }),
                      ...((userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) ||
                        (userIs('dreal') && autorité === 'dreal')) && {
                        demandeUrl: routes.DEMANDE_PAGE_DETAILS(id),
                      }),
                    })
                  }
                }
                break
              case 'DemandeAbandon':
                if (userIsNot('ademe')(user)) {
                  const { statut } = payload
                  events.push({
                    type,
                    variant: user.role,
                    date: valueDate,
                    statut,
                    ...(userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user) && {
                      demandeUrl: routes.DEMANDE_PAGE_DETAILS(id),
                    }),
                    ...(userIs(['admin', 'dgec-validateur'])(user) &&
                      statut === 'envoyée' && {
                        actionRequise: 'à traiter',
                      }),
                  })
                }
                break
              case 'CahierDesChargesChoisi':
                if (userIsNot('ademe')(user)) {
                  events.push({
                    type,
                    variant: user.role,
                    date: valueDate,
                    ...(payload.type === 'initial'
                      ? {
                          cahierDesCharges: 'initial',
                        }
                      : {
                          cahierDesCharges: 'modifié',
                          paruLe: payload.paruLe,
                          alternatif: payload.alternatif,
                        }),
                  })
                }
            }

            return Promise.resolve(events)
          },
          Promise.resolve([] as ProjectEventDTO[])
        ),
      }
    })
}

const getEvents = (projectId): ResultAsync<Array<KnownProjectEvents>, InfraNotAvailableError> => {
  return wrapInfra(
    ProjectEvent.findAll({ where: { projectId }, order: [['eventPublishedAt', 'ASC']] })
  ).map((events) => events.filter(isKnownProjectEvent))
}
