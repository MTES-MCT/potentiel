import { TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { GetProjectAppelOffre } from '../../projectAppelOffre';
import { err, logger } from '../../../core/utils';
import { FindProjectByIdentifiers } from '..';
import { ProjectRawDataImported } from '../events';
import { Project } from '../Project';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mediator } from 'mediateur';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { featureFlags } from '@potentiel-applications/feature-flags';

export const handleProjectRawDataImported =
  (deps: {
    findProjectByIdentifiers: FindProjectByIdentifiers;
    getProjectAppelOffre: GetProjectAppelOffre;
    projectRepo: TransactionalRepository<Project>;
  }) =>
  async (event: ProjectRawDataImported) => {
    const { findProjectByIdentifiers, projectRepo, getProjectAppelOffre } = deps;

    const { data, importId } = event.payload;
    const { appelOffreId, periodeId, familleId, numeroCRE, classe } = data;
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
        (project) => {
          return project.import({ appelOffre, data, importId });
        },
        { acceptNew: true },
      );
    });

    if (res.isErr()) {
      console.error('handleProjectRawDataImported error', res.error);
    }

    if (classe === 'Classé' && featureFlags.SHOW_GARANTIES_FINANCIERES) {
      const typeGarantiesFinancières =
        data.garantiesFinancièresType &&
        convertirGarantiesFinancièresType(data.garantiesFinancièresType);

      if (typeGarantiesFinancières) {
        const identifiantProjetValue = IdentifiantProjet.convertirEnValueType(
          `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
        ).formatter();

        try {
          await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
            type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
            data: {
              identifiantProjetValue,
              importéLeValue: new Date(event.occurredAt).toISOString(),
              typeValue: typeGarantiesFinancières,
              ...(data.garantiesFinancièresDateEchéance &&
                GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
                  typeGarantiesFinancières,
                ).estAvecDateÉchéance() && {
                  dateÉchéanceValue: new Date(data.garantiesFinancièresDateEchéance).toISOString(),
                }),
            },
          });
        } catch (error) {
          logger.error(
            `handleProjectRawDataImported : enregistrer le type de garantie financière (projet ${identifiantProjetValue}) : ${error.message}`,
          );
        }
      }
    }
  };

const convertirGarantiesFinancièresType = (typeImporté: string) => {
  switch (typeImporté) {
    case "Garantie financière jusqu'à 6 mois après la date d'achèvement":
      return GarantiesFinancières.TypeGarantiesFinancières.sixMoisAprèsAchèvement.type;
    case "Garantie financière avec date d'échéance et à renouveler":
      return GarantiesFinancières.TypeGarantiesFinancières.avecDateÉchéance.type;
    case 'Consignation':
      return GarantiesFinancières.TypeGarantiesFinancières.consignation.type;
  }
};
