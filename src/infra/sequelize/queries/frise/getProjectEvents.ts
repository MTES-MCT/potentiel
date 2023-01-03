import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ResultAsync, wrapInfra } from '@core/utils'
import { GetProjectEvents, ProjectEventDTO, ProjectStatus } from '@modules/frise'
import { userIs } from '@modules/users'
import { InfraNotAvailableError } from '@modules/shared'
import routes from '../../../../routes'
import { models } from '../../models'
import {
  GarantiesFinancières,
  isKnownProjectEvent,
  KnownProjectEvents,
  ProjectEvent,
  Raccordements,
} from '../../projectionsNext'
import { ProjectAppelOffre } from '@entities'
import { getGarantiesFinancièresDTO } from './getGarantiesFinancièresDTO'
import { getPtfDTO } from './getPtfDTO'

const { Project, File, User } = models

export const getProjectEvents: GetProjectEvents = ({ projectId, user }) => {
  return wrapInfra(
    Project.findByPk(projectId, {
      include: [
        {
          model: GarantiesFinancières,
          as: 'garantiesFinancières',
          required: false,
          attributes: [
            'statut',
            'fichierId',
            'envoyéesPar',
            'dateConstitution',
            'dateEchéance',
            'validéesPar',
            'dateLimiteEnvoi',
          ],
          include: [
            {
              model: File,
              as: 'fichier',
              required: false,
              attributes: ['filename', 'id'],
            },
            { model: User, as: 'envoyéesParRef', required: false, attributes: ['role'] },
          ],
        },
        {
          model: Raccordements,
          as: 'raccordement',
          include: [{ model: File, as: 'ptfFichier' }],
        },
      ],
    })
  )
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
        details,
        garantiesFinancières,
        raccordement,
      } = rawProject.get()
      const status: ProjectStatus = abandonedOn ? 'Abandonné' : classe
      const projectAppelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

      const garantiesFinancièresDTO = await getGarantiesFinancièresDTO({
        garantiesFinancières,
        user,
      })

      const ptfDTO = getPtfDTO({ ptf: raccordement, projetStatus: status, user })

      const garantieFinanciereEnMois =
        projectAppelOffre &&
        getGarantieFinanciereEnMois({
          projectAppelOffre,
          projectData: details,
        })

      return {
        project: {
          id: projectId,
          nomProjet,
          status,
          ...(garantieFinanciereEnMois && {
            garantieFinanciereEnMois,
          }),
        },
        events: (
          await rawEvents.reduce<Promise<ProjectEventDTO[]>>(
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
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'cre',
                      'caisse-des-dépôts',
                    ])(user) &&
                    payload.notifiedOn > 0
                  ) {
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
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'cre',
                      'caisse-des-dépôts',
                    ])(user)
                  ) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  break
                case 'ProjectClaimed':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'cre',
                    ])(user)
                  ) {
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
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'cre',
                    ])(user)
                  ) {
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
                case 'ProjectDCRRemoved':
                  if (userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  break
                case 'ProjectCompletionDueDateSet':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'cre',
                      'caisse-des-dépôts',
                    ])(user)
                  ) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      ...(payload?.reason === 'délaiCdc2022' && { délaiCDC2022Appliqué: true }),
                    })
                  }
                  break
                case 'ProjectDCRDueDateSet':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                    ])(user)
                  ) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  break
                case 'ModificationRequested':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
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
                          unitePuissance: projectAppelOffre?.unitePuissance,
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
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
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
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
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
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      modificationRequestId: payload.modificationRequestId,
                    })
                  }
                  break
                case 'ModificationReceived':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
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
                          unitePuissance: projectAppelOffre?.unitePuissance,
                        })
                        break
                    }
                  }
                  break
                case 'LegacyModificationImported':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
                    const modificationType = payload.modificationType
                    const status = payload.status

                    switch (modificationType) {
                      case 'abandon':
                        events.push({
                          type,
                          date: valueDate,
                          variant: user.role,
                          status,
                          ...(user.role !== 'caisse-des-dépôts' && { filename: payload.filename }),
                          modificationType,
                        })
                        break
                      case 'autre':
                        events.push({
                          type,
                          date: valueDate,
                          variant: user.role,
                          status,
                          ...(user.role !== 'caisse-des-dépôts' && { filename: payload.filename }),
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
                          ...(user.role !== 'caisse-des-dépôts' && { filename: payload.filename }),
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
                            ...(user.role !== 'caisse-des-dépôts' && {
                              filename: payload.filename,
                            }),
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
                          ...(user.role !== 'caisse-des-dépôts' && { filename: payload.filename }),
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
                          ...(user.role !== 'caisse-des-dépôts' && { filename: payload.filename }),
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
                  if (
                    userIs([
                      'porteur-projet',
                      'admin',
                      'dgec-validateur',
                      'dreal',
                      'acheteur-obligé',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
                    const { fileId, filename } = payload
                    events.push({
                      type: 'LegacyModificationFileAttached',
                      variant: user.role,
                      file: {
                        id: fileId,
                        name: filename,
                      },
                    })
                  }
                  break

                case 'DemandeDelaiSignaled':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
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
                      ...(userIs(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'cre'])(
                        user
                      ) && {
                        attachment,
                      }),
                    })
                  }
                  break

                case 'DemandeAbandonSignaled':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
                    const { signaledBy, status, attachment, notes } = payload
                    events.push({
                      type,
                      variant: user.role,
                      date: valueDate,
                      signaledBy,
                      status,
                      ...(userIs(['admin', 'dgec-validateur', 'dreal'])(user) && { notes }),
                      ...(userIs(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'cre'])(
                        user
                      ) && {
                        attachment,
                      }),
                    })
                  }
                  break
                case 'DemandeRecoursSignaled':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
                    const { signaledBy, status, attachment, notes } = payload
                    events.push({
                      type,
                      variant: user.role,
                      date: valueDate,
                      signaledBy,
                      status,
                      ...(userIs(['admin', 'dgec-validateur', 'dreal'])(user) && { notes }),
                      ...(userIs(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'cre'])(
                        user
                      ) && {
                        attachment,
                      }),
                    })
                  }
                  break

                case 'DemandeDélai':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
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
                        ...((userIs(['porteur-projet', 'admin', 'dgec-validateur', 'cre'])(user) ||
                          (userIs('dreal')(user) && autorité === 'dreal')) && {
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
                          (userIs('dreal')(user) && autorité === 'dreal')) && {
                          demandeUrl: routes.DEMANDE_PAGE_DETAILS(id),
                        }),
                      })
                    }
                  }
                  break
                case 'DemandeAbandon':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'caisse-des-dépôts',
                      'cre',
                    ])(user)
                  ) {
                    const { statut } = payload
                    events.push({
                      type,
                      variant: user.role,
                      date: valueDate,
                      statut,
                      ...(userIs(['porteur-projet', 'admin', 'dgec-validateur', 'cre'])(user) && {
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
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                      'cre',
                      'caisse-des-dépôts',
                    ])(user)
                  ) {
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
                  break
                case 'DateMiseEnService':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                    ])(user)
                  ) {
                    events.push({
                      type,
                      variant: user.role,
                      ...(payload.statut === 'renseignée'
                        ? {
                            date: new Date(payload.dateMiseEnService).getTime(),
                            statut: 'renseignée',
                          }
                        : { statut: 'non-renseignée' }),
                    })
                  }
                  break
                case 'DateFileAttente':
                  if (
                    userIs([
                      'admin',
                      'porteur-projet',
                      'dreal',
                      'acheteur-obligé',
                      'dgec-validateur',
                    ])(user)
                  ) {
                    events.push({
                      type,
                      variant: user.role,
                      date: new Date(payload.dateFileAttente).getTime(),
                    })
                  }
                  break
              }
              return Promise.resolve(events)
            },
            Promise.resolve([] as ProjectEventDTO[])
          )
        )
          .concat(garantiesFinancièresDTO ? [garantiesFinancièresDTO] : [])
          .concat(ptfDTO ? [ptfDTO] : []),
      }
    })
}

const getEvents = (projectId): ResultAsync<Array<KnownProjectEvents>, InfraNotAvailableError> => {
  return wrapInfra(
    ProjectEvent.findAll({ where: { projectId }, order: [['eventPublishedAt', 'ASC']] })
  ).map((events) => events.filter(isKnownProjectEvent))
}

type GetGarantieFinanciereEnMois = (args: {
  projectAppelOffre: ProjectAppelOffre
  projectData: Record<string, string>
}) => number | undefined

const getGarantieFinanciereEnMois: GetGarantieFinanciereEnMois = ({
  projectAppelOffre,
  projectData,
}) => {
  const { periode, famille, soumisAuxGarantiesFinancieres } = projectAppelOffre
  if (
    periode.garantieFinanciereEnMoisSansAutorisationEnvironnementale &&
    !['Dérogation', 'AU valide'].includes(
      projectData["Type d'autorisation environnementale (pièce n°3)"]
    )
  ) {
    return periode.garantieFinanciereEnMoisSansAutorisationEnvironnementale
  }
  return famille?.soumisAuxGarantiesFinancieres === 'après candidature'
    ? famille.garantieFinanciereEnMois
    : soumisAuxGarantiesFinancieres === 'après candidature'
    ? projectAppelOffre.garantieFinanciereEnMois
    : undefined
}
