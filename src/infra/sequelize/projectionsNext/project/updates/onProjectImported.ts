import { logger } from '../../../../../core/utils';
import { ProjectImported } from '../../../../../modules/project';
import { Project } from '../project.model';
import { ProjectProjector } from '../project.projector';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  TypeGarantiesFinancières,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

// TODO: Projection migrée en l'état, Project étant typé à any dans l'implémentation initiale, il manque des champs obligatoire lors de la création.
export const onProjectImported = ProjectProjector.on(
  ProjectImported,
  async (évènement, transaction) => {
    try {
      const {
        payload: { projectId, data, potentielIdentifier },
      } = évènement;
      await Project.create(
        {
          id: projectId,
          ...data,
          evaluationCarboneDeRéférence: data.evaluationCarbone,
          potentielIdentifier,
        } as any,
        { transaction },
      );

      await mediator.send<DomainUseCase>({
        type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          utilisateur: {
            rôle: 'admin',
          },
          identifiantProjet: convertirEnIdentifiantProjet({
            appelOffre: data.appelOffreId,
            famille: data.familleId,
            numéroCRE: data.numeroCRE,
            période: data.periodeId,
          }),
          typeGarantiesFinancières: data.garantiesFinancièresType as TypeGarantiesFinancières,
          dateÉchéance: data.garantiesFinancièresDateEchéance
            ? convertirEnDateTime(data.garantiesFinancièresDateEchéance)
            : undefined,
          attestationConstitution: undefined,
        },
      });
    } catch (error) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'évènement ProjectImported`,
          {
            évènement,
            nomProjection: 'Project.ProjectImported',
          },
          error,
        ),
      );
    }
  },
);
