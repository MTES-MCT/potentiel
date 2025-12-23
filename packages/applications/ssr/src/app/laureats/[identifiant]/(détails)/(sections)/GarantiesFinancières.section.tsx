import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../(components)/Section';
import { getAchèvement, getGarantiesFinancières, SectionWithErrorHandling } from '../../_helpers';

import { GarantiesFinancièresDétails } from './GarantiesFinancièresDétails';

type GarantiesFinancièresSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Garanties financières';

export const GarantiesFinancièresSection = ({
  identifiantProjet: identifiantProjetValue,
}: GarantiesFinancièresSectionProps) =>
  SectionWithErrorHandling(
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
        <Section title={sectionTitle}>
          <GarantiesFinancièresDétails
            garantiesFinancières={mapToPlainObject(garantiesFinancières)}
            estAchevé={achèvement.estAchevé}
            identifiantProjet={identifiantProjet.formatter()}
          />
        </Section>
      );
    }),
    sectionTitle,
  );

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

  const { actuelles, dépôt } = await getGarantiesFinancières(identifiantProjet.formatter());

  const motifGarantiesFinancièresEnAttente = await getMotifGfEnAttente(identifiantProjet, rôle);

  return {
    actuelles: actuelles
      ? {
          ...actuelles,
          dateÉchéance: actuelles.garantiesFinancières.estAvecDateÉchéance()
            ? actuelles.garantiesFinancières.dateÉchéance.formatter()
            : undefined,
        }
      : undefined,
    dépôt: dépôt
      ? {
          ...dépôt,
          dateÉchéance: dépôt.garantiesFinancières.estAvecDateÉchéance()
            ? dépôt.garantiesFinancières.dateÉchéance.formatter()
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
