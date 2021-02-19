import { err, errAsync, logger, ok, ResultAsync } from '../../../core/utils'
import { getAppelOffre } from '../../../dataAccess/inMemory'
import { GetProjectDataForProjectPage } from '../../../modules/project/queries/GetProjectDataForProjectPage'
import { InfraNotAvailableError, EntityNotFoundError } from '../../../modules/shared'

export const makeGetProjectDataForProjectPage = (models): GetProjectDataForProjectPage => ({
  projectId,
  user,
}) => {
  const { Project, File, User, UserProjects, ProjectAdmissionKey, ProjectPTF } = models
  if (!Project || !File || !User || !UserProjects || !ProjectAdmissionKey || !ProjectPTF)
    return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    Project.findByPk(projectId, {
      include: [
        {
          model: File,
          as: 'certificateFile',
          attributes: ['id', 'filename'],
        },
        {
          model: File,
          as: 'garantiesFinancieresFileRef',
          attributes: ['id', 'filename'],
        },
        {
          model: File,
          as: 'dcrFileRef',
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
              attributes: ['id', 'fullName', 'email'],
            },
          ],
        },
        {
          model: ProjectAdmissionKey,
          as: 'invitations',
          where: {
            cancelled: false,
            lastUsedAt: 0,
          },
          attributes: ['id', 'email'],
          required: false,
        },
        {
          model: ProjectAdmissionKey,
          as: 'invitationsForProjectEmail',
          where: {
            cancelled: false,
            lastUsedAt: 0,
          },
          attributes: ['id', 'email'],
          required: false,
        },
        {
          model: ProjectPTF,
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
    }),
    (e: Error) => {
      logger.error(e)
      return new InfraNotAvailableError()
    }
  ).andThen((projectRaw: any) => {
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
      certificateFile,
      classe,
      motifsElimination,
      garantiesFinancieresFileRef,
      garantiesFinancieresDueOn,
      garantiesFinancieresSubmittedOn,
      garantiesFinancieresDate,
      dcrFileRef,
      dcrDueOn,
      dcrSubmittedOn,
      dcrDate,
      dcrNumeroDossier,
      users,
      invitations,
      invitationsForProjectEmail,
      ptf,
    } = projectRaw.get()

    let allInvitations: any[] = []
    if (invitations) {
      allInvitations = [...allInvitations, ...invitations.map((item) => item.get())]
    }

    if (invitationsForProjectEmail) {
      allInvitations = [...allInvitations, ...invitationsForProjectEmail.map((item) => item.get())]
    }

    const result: any = {
      id,
      appelOffreId,
      periodeId,
      familleId,
      appelOffre: getAppelOffre({ appelOffreId, periodeId, familleId }),
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
      isClasse: classe === 'Classé',
      motifsElimination,
      users: users?.map(({ user }) => user),
      invitations: allInvitations,
    }

    if (user.role !== 'dreal') {
      result.prixReference = prixReference
    }

    if (!notifiedOn) return ok(result)

    if (certificateFile && user.role !== 'dreal') {
      result.certificateFile = certificateFile.get()
    }

    if (garantiesFinancieresDueOn) {
      result.garantiesFinancieresDueOn = new Date(garantiesFinancieresDueOn)

      if (garantiesFinancieresSubmittedOn) {
        result.garantiesFinancieresSubmittedOn = new Date(garantiesFinancieresSubmittedOn)
        result.garantiesFinancieresDate =
          garantiesFinancieresDate && new Date(garantiesFinancieresDate)
        result.garantiesFinancieresFile =
          garantiesFinancieresFileRef && garantiesFinancieresFileRef.get()
      }
    }

    if (dcrDueOn) {
      result.dcrDueOn = new Date(dcrDueOn)

      if (dcrSubmittedOn) {
        result.dcrSubmittedOn = new Date(dcrSubmittedOn)
        result.dcrDate = dcrDate && new Date(dcrDate)
        result.dcrFile = dcrFileRef && dcrFileRef.get()
        result.dcrNumeroDossier = dcrNumeroDossier
      }
    }

    if (ptf) {
      result.ptfSubmittedOn = ptf.submittedOn
      result.ptfDate = ptf.ptfDate
      result.ptfFile = ptf.file && ptf.file.get()
    }

    return ok(result)
  })
}
