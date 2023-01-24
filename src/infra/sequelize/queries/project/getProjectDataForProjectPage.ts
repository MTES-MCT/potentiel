import { err, ok, okAsync, Result, wrapInfra } from '@core/utils'
import { isPeriodeLegacy } from '@dataAccess/inMemory'
import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ProjectDataForProjectPage, GetProjectDataForProjectPage } from '@modules/project'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'
import { parseCahierDesChargesRéférence } from '@entities'
import routes from '@routes'
import { format } from 'date-fns'

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
    .andThen(
      (
        projectRaw: any
      ): Result<Omit<ProjectDataForProjectPage, 'isLegacy'>, EntityNotFoundError> => {
        if (!projectRaw) return err(new EntityNotFoundError())

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
          cahierDesChargesActuel: cahierDesChargesActuelRaw,
          potentielIdentifier,
          contratEDF,
          contratEnedis,
        } = projectRaw.get()

        if (!notifiedOn && !['admin', 'dgec-validateur', 'cre'].includes(user.role)) {
          return err(new EntityNotFoundError())
        }

        const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

        const cahierDesChargesActuel = parseCahierDesChargesRéférence(cahierDesChargesActuelRaw)

        const cahierDesCharges =
          cahierDesChargesActuel.type === 'initial'
            ? {
                type: 'initial',
                url: appelOffre?.periode.cahierDesCharges.url,
              }
            : {
                type: 'modifié',
                url: appelOffre?.cahiersDesChargesModifiésDisponibles.find(
                  (c) =>
                    c.paruLe === cahierDesChargesActuel.paruLe &&
                    c.alternatif === cahierDesChargesActuel.alternatif
                )?.url,
                paruLe: cahierDesChargesActuel.paruLe,
                alternatif: cahierDesChargesActuel.alternatif,
              }

        const result: any = {
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
          ...(user.role !== 'caisse-des-dépôts' && { fournisseur }),
          ...(user.role !== 'caisse-des-dépôts' && { evaluationCarbone }),
          note,
          details,
          notifiedOn: notifiedOn ? new Date(notifiedOn) : undefined,
          completionDueOn: completionDueOn ? new Date(completionDueOn) : undefined,
          isClasse: classe === 'Classé',
          isAbandoned: abandonedOn !== 0,
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
          cahierDesChargesActuel: cahierDesCharges,
        }

        if (user.role !== 'dreal') {
          result.prixReference = prixReference
        }

        if (!notifiedOn) return ok(result)

        if (user.role !== 'dreal') {
          result.certificateFile = certificateFile?.get()
        }

        return ok(result)
      }
    )
    .andThen((dto) => {
      const { appelOffreId, periodeId } = dto
      return wrapInfra(isPeriodeLegacy({ appelOffreId, periodeId })).map(
        (isLegacy) =>
          ({
            ...dto,
            isLegacy,
          } as ProjectDataForProjectPage)
      )
    })
    .andThen((dto) => {
      if (!dto.isAbandoned) {
        return okAsync(dto)
      }

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

        const cdcDispoPourAnnulationAbandon =
          appelOffre?.cahiersDesChargesModifiésDisponibles.filter(
            (cdc) =>
              cdc.délaiAnnulationAbandon &&
              new Date().getTime() <= cdc.délaiAnnulationAbandon.getTime()
          )

        const dateLimite =
          cahierDesChargesActuel.type === 'modifié'
            ? appelOffre?.cahiersDesChargesModifiésDisponibles.find(
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
        } as ProjectDataForProjectPage
      })
    })
}
