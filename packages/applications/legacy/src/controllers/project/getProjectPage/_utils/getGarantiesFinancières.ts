import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  isSoumisAuxGF: boolean,
): Promise<ProjectDataForProjectPage['garantiesFinancières'] | undefined> => {
  try {
    if (!isSoumisAuxGF) {
      return undefined;
    }

    const garantiesFinancièresActuelles =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    const dépôtEnCoursGarantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    const projetAvecGarantiesFinancièresEnAttente =
      await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
        {
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        },
      );

    const actuelles = Option.isSome(garantiesFinancièresActuelles)
      ? {
          type: garantiesFinancièresActuelles.garantiesFinancières.type.type,
          dateÉchéance:
            garantiesFinancièresActuelles.garantiesFinancières.dateÉchéance &&
            garantiesFinancièresActuelles.garantiesFinancières.dateÉchéance.formatter(),
          dateConstitution:
            garantiesFinancièresActuelles.garantiesFinancières.dateConstitution &&
            garantiesFinancièresActuelles.garantiesFinancières.dateConstitution.formatter(),
        }
      : undefined;

    const dépôtÀTraiter = Option.isSome(dépôtEnCoursGarantiesFinancières)
      ? {
          type: dépôtEnCoursGarantiesFinancières.dépôt.type.type,
          dateÉchéance:
            dépôtEnCoursGarantiesFinancières.dépôt.dateÉchéance &&
            dépôtEnCoursGarantiesFinancières.dépôt.dateÉchéance.formatter(),
          dateConstitution: dépôtEnCoursGarantiesFinancières.dépôt.dateConstitution.formatter(),
        }
      : undefined;

    const garantiesFinancièresEnAttente = Option.isSome(projetAvecGarantiesFinancièresEnAttente)
      ? { motif: projetAvecGarantiesFinancièresEnAttente.motif.motif }
      : undefined;

    return {
      actuelles,
      dépôtÀTraiter,
      garantiesFinancièresEnAttente,
    };
  } catch (error) {
    getLogger().error(`Impossible de consulter les garanties financières`, {
      identifiantProjet: identifiantProjet.formatter(),
      context: 'legacy',
      controller: 'getProjectPage',
      method: 'getGarantiesFinancières',
    });
    return undefined;
  }
};
