import { TransactionalRepository, UniqueEntityID } from '@core/domain';
import { logger, okAsync } from '@core/utils';
import { PeriodeNotified } from '../events/PeriodeNotified';
import { GenerateCertificate } from '../useCases/generateCertificate';
import { Project } from '../Project';
import { GetUnnotifiedProjectsForPeriode } from '../queries';
import { GetProjectAppelOffre } from '@modules/projectAppelOffre';

export const handlePeriodeNotified =
  (deps: {
    getUnnotifiedProjectsForPeriode: GetUnnotifiedProjectsForPeriode;
    projectRepo: TransactionalRepository<Project>;
    generateCertificate: GenerateCertificate;
    getProjectAppelOffre: GetProjectAppelOffre;
  }) =>
  async (event: PeriodeNotified) => {
    const {
      projectRepo,
      generateCertificate,
      getUnnotifiedProjectsForPeriode,
      getProjectAppelOffre,
    } = deps;

    const { periodeId, appelOffreId, notifiedOn, requestedBy } = event.payload;

    const unnotifiedProjectIdsResult = await getUnnotifiedProjectsForPeriode(
      appelOffreId,
      periodeId,
    );

    if (unnotifiedProjectIdsResult.isErr()) {
      return;
    }

    const unnotifiedProjectIds = unnotifiedProjectIdsResult.value;

    for (const unnotifiedProjectId of unnotifiedProjectIds) {
      await projectRepo
        .transaction(new UniqueEntityID(unnotifiedProjectId.projectId), (project) => {
          return project
            .notify({ notifiedOn })
            .map((): boolean => project.shouldCertificateBeGenerated);
        })
        .andThen((shouldCertificateBeGenerated) => {
          return shouldCertificateBeGenerated
            ? generateCertificate({
                projectId: unnotifiedProjectId.projectId,
                validateurId: requestedBy,
              }).map(() => null)
            : okAsync<null, never>(null);
        })
        .match(
          () => {},
          (e: Error) => {
            logger.error(e);
          },
        );
    }
  };
