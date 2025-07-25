import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Role } from '@potentiel-domain/utilisateur';
import { GarantiesFinancièresProjetProps } from '../../../../views/pages/projectDetailsPage/sections';

const getMotifGfEnAttente = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  role: Role.ValueType,
) => {
  if (!role.aLaPermission('garantiesFinancières.enAttente.consulter')) {
    return undefined;
  }

  const gfEnAttente =
    await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
      {
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      },
    );

  return Option.isSome(gfEnAttente) ? gfEnAttente.motif.motif : undefined;
};

export const getGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  role: Role.ValueType,
  isSoumisAuxGF: boolean,
): Promise<GarantiesFinancièresProjetProps['garantiesFinancières'] | undefined> => {
  try {
    if (!isSoumisAuxGF || !role.aLaPermission('garantiesFinancières.dépôt.consulter')) {
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

    const motifGfEnAttente = await getMotifGfEnAttente(identifiantProjet, role);

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

    return {
      actuelles,
      dépôtÀTraiter,
      motifGfEnAttente,
    };
  } catch (error) {
    getLogger('Legacy|getProjectPage|getGarantiesFinancières').error(
      `Impossible de consulter les garanties financières`,
      {
        identifiantProjet: identifiantProjet.formatter(),
      },
    );
    return undefined;
  }
};
