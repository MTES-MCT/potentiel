import { getProjectAppelOffre } from '../../../../config/queryProjectAO.config';
import { ResultAsync, wrapInfra } from '../../../../core/utils';
import { GetProjectEvents, ProjectEventDTO, ProjectStatus } from '../../../../modules/frise';
import { userIs } from '../../../../modules/users';
import { InfraNotAvailableError } from '../../../../modules/shared';
import routes from '../../../../routes';
import {
  isKnownProjectEvent,
  KnownProjectEvents,
  ProjectEvent,
  Project,
} from '../../projectionsNext';

export const getProjectEvents: GetProjectEvents = ({ projectId, user }) => {
  return wrapInfra(Project.findByPk(projectId))
    .andThen((rawProject: any) =>
      getEvents(projectId).map((rawEvents) => ({ rawProject, rawEvents })),
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
      } = rawProject.get();
      const status: ProjectStatus = abandonedOn ? 'Abandonné' : classe;
      const projectAppelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });

      return {
        project: {
          id: projectId,
          nomProjet,
          status,
        },
        events: await rawEvents.reduce<Promise<ProjectEventDTO[]>>(
          async (eventsPromise, projectEvent) => {
            const { type, valueDate, payload, id } = projectEvent;
            const events: ProjectEventDTO[] = await eventsPromise;

            switch (type) {
              case 'ProjectImported':
                if (userIs(['admin', 'dgec-validateur'])(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                  });
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
                  });
                }
                break;
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
                  });
                }
                break;
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
                  });
                }
                break;

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
                    ...(payload?.reason &&
                      [
                        'ChoixCDCAnnuleDélaiCdc2022',
                        'DateMiseEnServiceAnnuleDélaiCdc2022',
                        'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022',
                      ].includes(payload.reason) && { délaiCDC2022Annulé: true }),
                  });
                }
                break;
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
                  const { modificationType } = payload;

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
                      });
                      break;
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
                      });
                      break;
                  }
                }
                break;
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
                  });
                }
                break;
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
                  });
                }
                break;
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
                  });
                }
                break;
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
                  const { modificationType } = payload;

                  switch (modificationType) {
                    case 'actionnaire':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        actionnaire: payload.actionnaire,
                      });
                      break;
                    case 'fournisseur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        fournisseurs: payload.fournisseurs,
                      });
                      break;
                    case 'producteur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        producteur: payload.producteur,
                      });
                      break;
                    case 'puissance':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        puissance: payload.puissance,
                        unitePuissance: projectAppelOffre?.unitePuissance,
                      });
                      break;
                  }
                }
                break;
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
                  const modificationType = payload.modificationType;
                  const status = payload.status;

                  switch (modificationType) {
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
                      });
                      break;
                    case 'actionnaire':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        ...(user.role !== 'caisse-des-dépôts' && { filename: payload.filename }),
                        modificationType,
                        actionnairePrecedent: payload.actionnairePrecedent,
                      });
                      break;
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
                        });
                      }
                      break;
                    case 'producteur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        ...(user.role !== 'caisse-des-dépôts' && { filename: payload.filename }),
                        modificationType,
                        producteurPrecedent: payload.producteurPrecedent,
                      });
                      break;
                  }
                }
                break;
              case 'FileAttachedToProject':
                if (userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) {
                  const { title, description, files, attachedBy, attachmentId } = payload;
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
                  });
                }
                break;
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
                  const { fileId, filename } = payload;
                  events.push({
                    type: 'LegacyModificationFileAttached',
                    variant: user.role,
                    file: {
                      id: fileId,
                      name: filename,
                    },
                  });
                }
                break;

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
                  } = payload;
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
                    ...(userIs([
                      'admin',
                      'dgec-validateur',
                      'dreal',
                      'porteur-projet',
                      'cre',
                      'acheteur-obligé',
                    ])(user) && {
                      attachment,
                    }),
                  });
                }
                break;
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
                  const { statut, autorité } = payload;
                  if (statut === 'accordée-corrigée') {
                    events.push({
                      statut: 'accordée-corrigée',
                      type,
                      date: valueDate,
                      variant: user.role,
                      dateAchèvementAccordée: payload.dateAchèvementAccordée,
                      ...((userIs([
                        'porteur-projet',
                        'admin',
                        'dgec-validateur',
                        'cre',
                        'acheteur-obligé',
                      ])(user) ||
                        (userIs('dreal')(user) && autorité === 'dreal')) && {
                        demandeUrl: routes.GET_DETAILS_DEMANDE_DELAI_PAGE(id),
                      }),
                    });
                  } else if (payload.dateAchèvementDemandée) {
                    const { dateAchèvementDemandée } = payload;
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
                      ...((userIs([
                        'porteur-projet',
                        'admin',
                        'dgec-validateur',
                        'cre',
                        'acheteur-obligé',
                      ])(user) ||
                        (userIs('dreal')(user) && autorité === 'dreal')) && {
                        demandeUrl: routes.GET_DETAILS_DEMANDE_DELAI_PAGE(id),
                      }),
                    });
                  } else if (payload.délaiEnMoisDemandé) {
                    const { délaiEnMoisDemandé } = payload;
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
                      ...((userIs([
                        'porteur-projet',
                        'admin',
                        'dgec-validateur',
                        'acheteur-obligé',
                        'cre',
                      ])(user) ||
                        (userIs('dreal')(user) && autorité === 'dreal')) && {
                        demandeUrl: routes.GET_DETAILS_DEMANDE_DELAI_PAGE(id),
                      }),
                    });
                  }
                }
                break;
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
                  });
                }
                break;
            }
            return Promise.resolve(events);
          },
          Promise.resolve([] as ProjectEventDTO[]),
        ),
      };
    });
};

const getEvents = (projectId): ResultAsync<Array<KnownProjectEvents>, InfraNotAvailableError> => {
  return wrapInfra(
    ProjectEvent.findAll({ where: { projectId }, order: [['eventPublishedAt', 'ASC']] }),
  ).map((events) => events.filter(isKnownProjectEvent));
};
