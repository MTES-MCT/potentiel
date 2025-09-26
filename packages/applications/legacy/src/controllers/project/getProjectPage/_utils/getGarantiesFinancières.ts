import { mediator } from 'mediateur';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

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
    await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresEnAttenteQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

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
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    const dépôtEnCoursGarantiesFinancières =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    const motifGfEnAttente = await getMotifGfEnAttente(identifiantProjet, role);

    const actuelles = Option.isSome(garantiesFinancièresActuelles)
      ? {
          ...garantiesFinancièresActuelles.garantiesFinancières.formatter(),
          attestation: garantiesFinancièresActuelles.document?.formatter(),
        }
      : undefined;

    const dépôtÀTraiter = Option.isSome(dépôtEnCoursGarantiesFinancières)
      ? {
          ...dépôtEnCoursGarantiesFinancières.garantiesFinancières.formatter(),
          dateConstitution:
            dépôtEnCoursGarantiesFinancières.garantiesFinancières.constitution!.date.formatter(),
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
