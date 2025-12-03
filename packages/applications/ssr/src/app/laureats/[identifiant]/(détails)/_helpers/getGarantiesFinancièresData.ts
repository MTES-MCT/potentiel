import { mediator } from 'mediateur';

import { Candidature, DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  estSoumisAuxGarantiesFinancières: boolean;
};

export type GetGarantiesFinancièresData = {
  motifGfEnAttente?: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType;
  actuelles?: {
    type?: Candidature.TypeGarantiesFinancières.RawType;
    dateConstitution?: DateTime.RawType;
    dateÉchéance?: DateTime.RawType;
    attestation?: DocumentProjet.RawType;
  };
  dépôtÀTraiter?: {
    type?: Candidature.TypeGarantiesFinancières.RawType;
    dateConstitution: DateTime.RawType;
    dateÉchéance?: DateTime.RawType;
  };
};

export const getGarantiesFinancièresData = async ({
  identifiantProjet,
  rôle,
  estSoumisAuxGarantiesFinancières,
}: Props): Promise<GetGarantiesFinancièresData | undefined> => {
  if (
    !estSoumisAuxGarantiesFinancières ||
    !rôle.aLaPermission('garantiesFinancières.dépôt.consulter')
  ) {
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

  const motifGfEnAttente = await getMotifGfEnAttente(identifiantProjet, rôle);

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
};

const getMotifGfEnAttente = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: Role.ValueType,
) => {
  if (!rôle.aLaPermission('garantiesFinancières.enAttente.consulter')) {
    return undefined;
  }

  const gfEnAttente =
    await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresEnAttenteQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

  return Option.isSome(gfEnAttente) ? gfEnAttente.motif.motif : undefined;
};
