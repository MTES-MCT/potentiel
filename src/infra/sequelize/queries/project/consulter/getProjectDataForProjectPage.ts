import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { ProjectDataForProjectPage, GetProjectDataForProjectPage } from '@modules/project'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import models from '../../../models'
import { CahierDesCharges, parseCahierDesChargesRéférence, ProjectAppelOffre } from '@entities'
import routes from '@routes'
import { format } from 'date-fns'
import { userIs, userIsNot } from '@modules/users'
import { Project } from '../../../projections/project/project.model'
import { Raccordements } from '@infra/sequelize'

const { Project: ProjectTable, File, User, UserProjects, ModificationRequest } = models

export const getProjectDataForProjectPage: GetProjectDataForProjectPage = ({ projectId, user }) => {
  const chargerProjet = wrapInfra(
    ProjectTable.findByPk(projectId, {
      include: [
        {
          model: File,
          as: 'certificateFile',
          attributes: ['id', 'filename'],
        },
        {
          model: Raccordements,
          as: 'raccordements',
          attributes: ['identifiantGestionnaire'],
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
  const vérifierAccèsProjet = (
    project: Project | null
  ): ResultAsync<Project, EntityNotFoundError> => {
    if (!project || (!project.notifiedOn && userIsNot(['admin', 'dgec-validateur', 'cre'])(user))) {
      return errAsync(new EntityNotFoundError())
    }

    return okAsync(project)
  }

  const récupérerAppelOffre = (
    project: Project
  ): ResultAsync<{ project: any; appelOffre: ProjectAppelOffre }, EntityNotFoundError> => {
    const { appelOffreId, periodeId, familleId } = project
    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

    if (!appelOffre) {
      return errAsync(new EntityNotFoundError())
    }

    return okAsync({ project: project as any, appelOffre })
  }

  const récupérerCahierDesCharges = ({
    appelOffre,
    project,
  }: {
    project: any
    appelOffre: ProjectAppelOffre
  }): ResultAsync<
    {
      appelOffre: ProjectAppelOffre
      project: any
      cahierDesCharges:
        | CahierDesCharges
        | { type: string; url: string; paruLe?: undefined; alternatif?: undefined }
        | {
            type: string
            url: string | undefined
            paruLe: '30/07/2021' | '30/08/2022' | '07/02/2023'
            alternatif: true | undefined
          }
    },
    never
  > => {
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
  }
  return chargerProjet
    .andThen(vérifierAccèsProjet)
    .andThen(récupérerAppelOffre)
    .andThen(récupérerCahierDesCharges)
    .andThen(
      ({
        appelOffre,
        cahierDesCharges: cahierDesChargesActuel,
        project: {
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
          raccordements,
        },
      }): ResultAsync<ProjectDataForProjectPage, never> =>
        okAsync({
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
          ...(userIs([
            'admin',
            'porteur-projet',
            'acheteur-obligé',
            'ademe',
            'dgec-validateur',
            'caisse-des-dépôts',
            'cre',
          ])(user) && {
            prixReference,
            ...(notifiedOn && { certificateFile }),
          }),
          ...(userIs([
            'admin',
            'porteur-projet',
            'dreal',
            'acheteur-obligé',
            'ademe',
            'dgec-validateur',
            'cre',
          ])(user) && { fournisseur, evaluationCarbone }),
          ...(userIs([
            'admin',
            'porteur-projet',
            'dreal',
            'acheteur-obligé',
            'dgec-validateur',
            'cre',
          ])(user) &&
            raccordements &&
            raccordements.identifiantGestionnaire && {
              gestionnaireDeRéseau: {
                identifiantGestionnaire: raccordements.identifiantGestionnaire,
              },
            }),
        })
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
  ).map((demande) => {
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
