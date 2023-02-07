import { err, errAsync, ok, okAsync, Result, ResultAsync, wrapInfra } from '@core/utils'
import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ProjectDataForProjectPage, GetProjectDataForProjectPage } from '@modules/project'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import models from '../../models'
import { parseCahierDesChargesRéférence } from '@entities'
import routes from '@routes'
import { format } from 'date-fns'
import { userIsNot } from '@modules/users'

const { Project, File, User, UserProjects, ModificationRequest } = models

export const getProjectDataForProjectPage: GetProjectDataForProjectPage = ({ projectId, user }) => {
  return wrapInfra(
    Project.findByPk(projectId, {
      include: [
        {
          model: File,
          as: 'certificateFile',
          attributes: ['id', 'filename'],
        },
        {
          model: UserProjects,
          as: 'users',
          where: { projectId },
          required: false,
          include: [
            {
              model: User,
              attributes: ['id', 'fullName', 'email', 'registeredOn'],
            },
          ],
        },
      ],
    })
  )
    .andThen((project) => {
      if (!project) return err(new EntityNotFoundError())

      if (!project.notifiedOn && !['admin', 'dgec-validateur', 'cre'].includes(user.role)) {
        return err(new EntityNotFoundError())
      }

      return okAsync(project)
    })
    .andThen((project) => {
      const { appelOffreId, periodeId, familleId } = project
      const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

      if (!appelOffre) {
        return errAsync(new EntityNotFoundError())
      }

      return okAsync({ project: project as any, appelOffre })
    })
    .andThen(({ appelOffre, project }) => {
      const { cahierDesChargesActuel: cahierDesChargesActuelRaw } = project

      const cahierDesChargesActuel = parseCahierDesChargesRéférence(cahierDesChargesActuelRaw)

      const cahierDesCharges =
        cahierDesChargesActuel.type === 'initial'
          ? {
              type: 'initial',
              url: appelOffre.periode.cahierDesCharges.url,
            }
          : {
              type: 'modifié',
              url: appelOffre.cahiersDesChargesModifiésDisponibles.find(
                (c) =>
                  c.paruLe === cahierDesChargesActuel.paruLe &&
                  c.alternatif === cahierDesChargesActuel.alternatif
              )?.url,
              paruLe: cahierDesChargesActuel.paruLe,
              alternatif: cahierDesChargesActuel.alternatif,
            }

      return okAsync({ appelOffre, project, cahierDesCharges })
    })
    .andThen(
      ({
        appelOffre,
        cahierDesCharges: cahierDesChargesActuel,
        project: projectRaw,
      }): Result<ProjectDataForProjectPage, EntityNotFoundError> => {
        const {
          id,
          appelOffreId,
          periodeId,
          familleId,
          numeroCRE,
          puissance,
          prixReference,
          engagementFournitureDePuissanceAlaPointe,
          isFinancementParticipatif,
          isInvestissementParticipatif,
          adresseProjet,
          codePostalProjet,
          communeProjet,
          departementProjet,
          regionProjet,
          territoireProjet,
          nomProjet,
          nomCandidat,
          nomRepresentantLegal,
          email,
          fournisseur,
          evaluationCarbone,
          note,
          details,
          notifiedOn,
          abandonedOn,
          certificateFile,
          classe,
          motifsElimination,
          users,
          completionDueOn,
          updatedAt,
          potentielIdentifier,
          contratEDF,
          contratEnedis,
        } = projectRaw.get()

        return ok({
          id,
          potentielIdentifier,
          appelOffreId,
          periodeId,
          familleId,
          appelOffre,
          numeroCRE,
          puissance,
          engagementFournitureDePuissanceAlaPointe,
          isFinancementParticipatif,
          isInvestissementParticipatif,
          adresseProjet,
          codePostalProjet,
          communeProjet,
          departementProjet,
          regionProjet,
          territoireProjet,
          nomProjet,
          nomCandidat,
          nomRepresentantLegal,
          email,
          note,
          details,
          notifiedOn: notifiedOn ? new Date(notifiedOn) : undefined,
          completionDueOn: completionDueOn ? new Date(completionDueOn) : undefined,
          isClasse: classe === 'Classé',
          isAbandoned: abandonedOn !== 0,
          isLegacy: appelOffre.periode.type === 'legacy',
          motifsElimination,
          users: users
            ?.map(({ user }) => user.get())
            .map(({ id, email, fullName }) => ({
              id,
              email,
              fullName,
            })),
          updatedAt,
          contratEDF,
          contratEnedis,
          cahierDesChargesActuel,
          ...(userIsNot('dreal')(user) && {
            prixReference,
            ...(notifiedOn && { certificateFile }),
          }),
          ...(userIsNot('caisse-des-dépôts')(user) && { fournisseur, evaluationCarbone }),
        })
      }
    )
    .andThen((dto) => (dto.isAbandoned ? ajouterInfosAlerteAnnulationAbandon(dto) : okAsync(dto)))
}

const ajouterInfosAlerteAnnulationAbandon = (
  dto: ProjectDataForProjectPage
): ResultAsync<ProjectDataForProjectPage, InfraNotAvailableError> => {
  const { id: projectId, appelOffre, cahierDesChargesActuel } = dto

  return wrapInfra(
    ModificationRequest.findOne({
      where: { projectId, type: 'annulation abandon', status: 'envoyée' },
    })
  ).map((demande: { id: string }) => {
    if (demande) {
      return {
        ...dto,
        alerteAnnulationAbandon: {
          actionPossible: 'voir-demande-en-cours' as const,
          urlDemandeEnCours: routes.DEMANDE_PAGE_DETAILS(demande.id),
        },
      }
    }

    const cdcDispoPourAnnulationAbandon = appelOffre?.cahiersDesChargesModifiésDisponibles.filter(
      (cdc) =>
        cdc.délaiAnnulationAbandon && new Date().getTime() <= cdc.délaiAnnulationAbandon.getTime()
    )

    const dateLimite =
      cahierDesChargesActuel.type === 'modifié'
        ? appelOffre.cahiersDesChargesModifiésDisponibles.find(
            (cdc) =>
              cdc.paruLe === cahierDesChargesActuel.paruLe &&
              cdc.alternatif === cahierDesChargesActuel.alternatif
          )?.délaiAnnulationAbandon
        : undefined

    const cdcActuelPermetAnnulationAbandon = dateLimite ? true : false

    return {
      ...dto,
      ...((cdcActuelPermetAnnulationAbandon || cdcDispoPourAnnulationAbandon.length > 0) && {
        alerteAnnulationAbandon: {
          ...(cdcActuelPermetAnnulationAbandon
            ? {
                actionPossible: 'demander-annulation-abandon',
                dateLimite: format(dateLimite!, 'PPP'),
              }
            : {
                actionPossible: 'choisir-nouveau-cdc',
                cdcAvecOptionAnnulationAbandon: cdcDispoPourAnnulationAbandon.map(
                  ({ paruLe, alternatif, type }) => ({
                    paruLe,
                    alternatif,
                    type,
                  })
                ),
              }),
        },
      }),
    }
  })
}
