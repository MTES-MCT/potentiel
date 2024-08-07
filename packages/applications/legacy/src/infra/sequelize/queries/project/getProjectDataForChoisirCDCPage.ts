import { errAsync, okAsync, wrapInfra } from '../../../../core/utils';
import { EntityNotFoundError } from '../../../../modules/shared';
import { GetProjectDataForChoisirCDCPage } from '../../../../modules/project';
import { Project, ProjectEvent } from '../../projectionsNext';
import { getProjectAppelOffre } from '../../../../config/queryProjectAO.config';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export const getProjectDataForChoisirCDCPage: GetProjectDataForChoisirCDCPage = (projectId) =>
  wrapInfra(
    Project.findByPk(projectId, {
      attributes: ['id', 'appelOffreId', 'familleId', 'periodeId', 'cahierDesChargesActuel'],
    }),
  )
    .andThen((projet) => {
      if (!projet) {
        return errAsync(new EntityNotFoundError());
      }

      const appelOffre = getProjectAppelOffre({
        appelOffreId: projet.appelOffreId,
        periodeId: projet.periodeId,
        familleId: projet.familleId,
      });

      if (!appelOffre) {
        return errAsync(new EntityNotFoundError());
      }

      const projetProps = {
        id: projet.id,
        cahierDesChargesActuel:
          projet.cahierDesChargesActuel as AppelOffre.CahierDesChargesRéférence,
        appelOffre,
      };

      return okAsync(projetProps);
    })
    .andThen((projetProps) =>
      wrapInfra(
        ProjectEvent.findOne({
          where: {
            type: 'ProjectCompletionDueDateSet',
            'payload.reason': 'délaiCdc2022',
            projectId: projetProps.id,
          },
        }),
      ).andThen((projectEvent) => {
        if (!projectEvent) {
          return okAsync(projetProps);
        } else {
          return okAsync({ ...projetProps, délaiCDC2022Appliqué: true });
        }
      }),
    );
