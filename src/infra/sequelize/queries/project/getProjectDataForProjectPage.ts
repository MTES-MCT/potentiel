import { err, ok, Result, wrapInfra } from '@core/utils'
import { isPeriodeLegacy } from '@dataAccess/inMemory'
import { getProjectAppelOffre } from '@config/queries.config'
import { ProjectDataForProjectPage, GetProjectDataForProjectPage } from '@modules/project'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'
import { parseCahierDesChargesRéférence } from '@entities'

const { Project, File, User, UserProjects, ProjectStep } = models
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
        {
          model: ProjectStep,
          as: 'gf',
          required: false,
          include: [
            {
              model: File,
              as: 'file',
              attributes: ['id', 'filename'],
            },
          ],
        },
        {
          model: ProjectStep,
          as: 'ptf',
          required: false,
          include: [
            {
              model: File,
              as: 'file',
              attributes: ['id', 'filename'],
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
          garantiesFinancieresDueOn,
          users,
          gf,
          ptf,
          completionDueOn,
          updatedAt,
          cahierDesChargesActuel: cahierDesChargesActuelRaw,
          potentielIdentifier,
          contratEDF,
          contratEnedis,
        } = projectRaw.get()

        if (!notifiedOn && !['admin', 'dgec-validateur'].includes(user.role)) {
          return err(new EntityNotFoundError())
        }

        const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

        const cahierDesChargesActuel = parseCahierDesChargesRéférence(cahierDesChargesActuelRaw)
        const cahierDesCharges =
          cahierDesChargesActuel.paruLe === 'initial'
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
          fournisseur,
          evaluationCarbone,
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
          garantiesFinancieres: undefined,
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

        if (garantiesFinancieresDueOn) {
          result.garantiesFinancieres = { dueOn: new Date(garantiesFinancieresDueOn) }
        }

        if (gf) {
          const { submittedOn, status, file, stepDate } = gf

          result.garantiesFinancieres = {
            ...result.garantiesFinancieres,
            submittedOn,
            file: file?.get(),
            gfDate: stepDate,
            gfStatus: status,
          }
        }

        if (ptf) {
          const { submittedOn, file, stepDate } = ptf
          result.ptf = {
            ...result.ptf,
            submittedOn,
            file: file?.get(),
            ptfDate: stepDate,
          }
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
}
