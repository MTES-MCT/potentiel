import { TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { GetProjectAppelOffre } from '../../projectAppelOffre';
import { err, logger } from '../../../core/utils';
import { FindProjectByIdentifiers } from '..';
import { ProjectRawDataImported } from '../events';
import { Project } from '../Project';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

export const handleProjectRawDataImported =
  (deps: {
    findProjectByIdentifiers: FindProjectByIdentifiers;
    getProjectAppelOffre: GetProjectAppelOffre;
    projectRepo: TransactionalRepository<Project>;
  }) =>
  async (event: ProjectRawDataImported) => {
    const { findProjectByIdentifiers, projectRepo, getProjectAppelOffre } = deps;

    const { data, importId } = event.payload;
    const { appelOffreId, periodeId, familleId, numeroCRE } = data;
    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId });

    // PAD: There is a concurrency risk here:
    // findProjectByIdentifiers might return null AFTER a ProjectImported has been emitted for the same project (because of eventual consistency)
    // The effect would be to have two projects with the same identifiers
    // To avoid this, we could use the appelOffreId/periodeId/familleId/numeroCRE as the aggregate id for projects and open a transaction
    // Or, avoid doing multiple imports simultaneously (recommended for now)
    // Trello card: https://trello.com/c/5ip9c3Ht/584-revoir-laggregateid-pour-lagrégat-projet
    const res = await findProjectByIdentifiers({
      appelOffreId,
      periodeId,
      familleId,
      numeroCRE,
    }).andThen((projectIdOrNull) => {
      if (!appelOffre) {
        return err(new Error(`L'appel offre ${appelOffreId} n'existe pas`));
      }

      return projectRepo.transaction(
        new UniqueEntityID(projectIdOrNull || undefined),
        (project) => project.import({ appelOffre, data, importId }),
        { acceptNew: true },
      );
    });

    if (res.isErr()) {
      logger.error(`handleProjectRawDataImported error : ${res.error}`);
    }

    if (data.garantiesFinancièresType) {
      const identifiantProjet = convertirEnIdentifiantProjet({
        appelOffre: data.appelOffreId,
        famille: data.familleId,
        numéroCRE: data.numeroCRE,
        période: data.periodeId,
      });
      try {
        await mediator.send<DomainUseCase>({
          type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
          data: {
            utilisateur: {
              rôle: 'admin',
            },
            identifiantProjet,
            typeGarantiesFinancières: data.garantiesFinancièresType,
            dateÉchéance: data.garantiesFinancièresDateEchéance
              ? convertirEnDateTime(data.garantiesFinancièresDateEchéance)
              : undefined,
            attestationConstitution: undefined,
          },
        });
      } catch (error) {
        logger.error(
          `handleProjectRawDataImported : enregistrer le type de garantie financière (projet ${identifiantProjet}) : ${error.message}`,
        );
      }
    }
  };
