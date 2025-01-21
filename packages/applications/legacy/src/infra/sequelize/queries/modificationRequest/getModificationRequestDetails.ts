import { err, ok, wrapInfra } from '../../../../core/utils';
import { getProjectAppelOffre } from '../../../../config/queryProjectAO.config';
import {
  GetModificationRequestDetails,
  ModificationRequestPageDTO,
} from '../../../../modules/modificationRequest';
import { EntityNotFoundError } from '../../../../modules/shared';
import { parseCahierDesChargesRéférence, ProjectAppelOffre } from '../../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ModificationRequest, Project, User, File } from '../..';

export const getModificationRequestDetails: GetModificationRequestDetails = (
  modificationRequestId,
) => {
  return wrapInfra(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: File,
          as: 'attachmentFile',
          attributes: ['id', 'filename'],
        },
        {
          model: File,
          as: 'responseFile',
          attributes: ['id', 'filename'],
        },
        {
          model: Project,
          as: 'project',
          attributes: [
            'id',
            'numeroCRE',
            'nomProjet',
            'nomCandidat',
            'communeProjet',
            'departementProjet',
            'regionProjet',
            'puissance',
            'puissanceInitiale',
            'notifiedOn',
            'appelOffreId',
            'periodeId',
            'familleId',
            'completionDueOn',
            'potentielIdentifier',
            'technologie',
            'cahierDesChargesActuel',
            'note',
          ],
        },
        {
          model: User,
          as: 'requestedBy',
          attributes: ['fullName'],
        },
        {
          model: User,
          as: 'respondedByUser',
          attributes: ['fullName'],
        },
        {
          model: User,
          as: 'cancelledByUser',
          attributes: ['fullName'],
        },
        {
          model: User,
          as: 'delaiCorrigeParUser',
          attributes: ['fullName'],
        },
      ],
    }),
  ).andThen((modificationRequestRaw: any) => {
    if (!modificationRequestRaw) return err(new EntityNotFoundError());
    const {
      id,
      type,
      status,
      requestedOn,
      requestedBy,
      respondedOn,
      respondedByUser,
      cancelledByUser,
      justification,
      attachmentFile,
      responseFile,
      project,
      versionDate,
      delayInMonths,
      puissance,
      puissanceAuMomentDuDepot,
      fournisseurs,
      evaluationCarbone,
      producteur,
      acceptanceParams,
      cancelledOn,
      dateAchèvementDemandée,
      authority,
      cahierDesCharges: cahierDesChargesRéférence,
      délaiAccordéCorrigéLe,
      delaiCorrigeParUser,
      dateAchèvementAprèsCorrectionDélaiAccordé,
    } = modificationRequestRaw.get();

    const { appelOffreId, periodeId, notifiedOn, completionDueOn, technologie } = project.get();
    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId });

    return ok<ModificationRequestPageDTO>({
      id,
      type,
      versionDate: new Date(versionDate).getTime(),
      status,
      requestedOn: new Date(requestedOn).getTime(),
      requestedBy: requestedBy.get().fullName,
      respondedOn: respondedOn && new Date(respondedOn).getTime(),
      respondedBy: respondedByUser?.get().fullName,
      responseFile: responseFile?.get(),
      cancelledOn: cancelledOn && new Date(cancelledOn).getTime(),
      cancelledBy: cancelledByUser?.get().fullName,
      acceptanceParams,
      justification,
      attachmentFile: attachmentFile?.get(),
      delayInMonths,
      dateAchèvementDemandée,
      //@ts-ignore
      fournisseurs,
      evaluationCarbone,
      producteur,
      authority,
      project: {
        ...project.get(),
        notifiedOn: new Date(notifiedOn).getTime(),
        completionDueOn: new Date(completionDueOn).getTime(),
        unitePuissance: appelOffre?.unitePuissance || '??',
        technologie: technologie || 'N/A',
        cahiersDesChargesUrl: appelOffre?.cahiersDesChargesUrl,
        appelOffre,
      },
      ...(type === 'puissance' && {
        puissanceAuMomentDuDepot,
        puissance,
      }),
      cahierDesCharges:
        appelOffre && cahierDesChargesRéférence
          ? formatCahierDesCharges({ appelOffre, cahierDesChargesRéférence })
          : undefined,
      délaiAccordéCorrigéLe,
      délaiAccordéCorrigéPar: delaiCorrigeParUser?.get().fullName,
      dateAchèvementAprèsCorrectionDélaiAccordé,
    });
  });
};

const formatCahierDesCharges = ({
  cahierDesChargesRéférence,
  appelOffre,
}: {
  cahierDesChargesRéférence: AppelOffre.CahierDesChargesRéférence;
  appelOffre: ProjectAppelOffre;
}): ModificationRequestPageDTO['cahierDesCharges'] => {
  const cahierDesChargesRéférenceParsed = parseCahierDesChargesRéférence(cahierDesChargesRéférence);

  if (cahierDesChargesRéférenceParsed.type === 'initial') {
    return {
      type: 'initial',
      url: appelOffre.cahiersDesChargesUrl,
    };
  }

  const cahiersDesChargesModifié = appelOffre.periode.cahiersDesChargesModifiésDisponibles.find(
    (c) =>
      cahierDesChargesRéférenceParsed.type === 'modifié' &&
      c.paruLe === cahierDesChargesRéférenceParsed.paruLe &&
      c.alternatif === cahierDesChargesRéférenceParsed.alternatif,
  );

  if (!cahiersDesChargesModifié) return undefined;

  return {
    type: 'modifié',
    url: appelOffre.cahiersDesChargesUrl,
    paruLe: cahiersDesChargesModifié.paruLe,
    alternatif: cahiersDesChargesModifié.alternatif,
  };
};
