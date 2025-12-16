import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../(components)/Section';
import { getAchèvement } from '../../_helpers/getAchèvement';
import { getCahierDesCharges } from '../../../../../_helpers';

import { GarantiesFinancièresDétails } from './GarantiesFinancièresDétails';

type GarantiesFinancièresSectionProps = {
  identifiantProjet: string;
};

export const GarantiesFinancièresSection = ({
  identifiantProjet: identifiantProjetValue,
}: GarantiesFinancièresSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const garantiesFinancières = await getGarantiesFinancièresData({
      identifiantProjet,
      rôle,
      estSoumisAuxGarantiesFinancières: cahierDesCharges.estSoumisAuxGarantiesFinancières(),
    });

    if (!garantiesFinancières) {
      return null;
    }

    const achèvement = await getAchèvement(identifiantProjet.formatter());

    return (
      <Section title="Garanties financières">
        <GarantiesFinancièresDétails
          garantiesFinancières={mapToPlainObject(garantiesFinancières)}
          estAchevé={achèvement.estAchevé}
          identifiantProjet={identifiantProjet.formatter()}
        />
      </Section>
    );
  });

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  estSoumisAuxGarantiesFinancières: boolean;
};

export const getGarantiesFinancièresData = async ({
  identifiantProjet,
  rôle,
  estSoumisAuxGarantiesFinancières,
}: Props) => {
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

  const motifGarantiesFinancièresEnAttente = await getMotifGfEnAttente(identifiantProjet, rôle);

  return {
    actuelles: Option.isSome(garantiesFinancièresActuelles)
      ? {
          ...garantiesFinancièresActuelles,
          dateÉchéance: garantiesFinancièresActuelles.garantiesFinancières.estAvecDateÉchéance()
            ? garantiesFinancièresActuelles.garantiesFinancières.dateÉchéance.formatter()
            : undefined,
        }
      : undefined,
    dépôt: Option.isSome(dépôtEnCoursGarantiesFinancières)
      ? {
          ...dépôtEnCoursGarantiesFinancières,
          dateÉchéance: dépôtEnCoursGarantiesFinancières.garantiesFinancières.estAvecDateÉchéance()
            ? dépôtEnCoursGarantiesFinancières.garantiesFinancières.dateÉchéance.formatter()
            : undefined,
        }
      : undefined,
    motifGarantiesFinancièresEnAttente,
  };
};

const getMotifGfEnAttente = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: Role.ValueType,
) => {
  if (!rôle.aLaPermission('garantiesFinancières.enAttente.consulter')) {
    return undefined;
  }

  const garantiesFinancièresEnAttente =
    await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresEnAttenteQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

  return Option.isSome(garantiesFinancièresEnAttente)
    ? garantiesFinancièresEnAttente.motif.motif
    : undefined;
};
