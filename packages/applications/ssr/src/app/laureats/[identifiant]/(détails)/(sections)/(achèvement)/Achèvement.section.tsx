import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Routes } from '@potentiel-applications/routes';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { AchèvementDétails } from './AchèvementDétails';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Section } from '../../(components)/Section';
import { Role } from '@potentiel-domain/utilisateur';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { Option } from '@potentiel-libraries/monads';

type AchèvementSectionProps = {
  identifiantProjet: string;
};

export const AchèvementSection = ({
  identifiantProjet: identifiantProjetValue,
}: AchèvementSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const achèvement = await getAchèvement(identifiantProjet.formatter(), rôle);

    return (
      <Section title="Achèvement">
        <AchèvementDétails
          actions={achèvement.actions}
          value={mapToPlainObject(achèvement.value)}
        />
      </Section>
    );
  });

export const getAchèvement = async (
  identifiantProjet: IdentifiantProjet.RawType,
  rôle: Role.ValueType,
) => {
  const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
    data: { identifiantProjetValue: identifiantProjet },
  });

  if (Option.isNone(achèvement)) {
    return notFound();
  }

  const actions = [];

  if (rôle.aLaPermission('achèvement.modifier')) {
    actions.push({
      label: "Modifier les informations d'achèvement du projet",
      url: Routes.Achèvement.modifierAttestationConformité(identifiantProjet),
    });
  }

  if (rôle.aLaPermission('achèvement.transmettreAttestation') && !achèvement.estAchevé) {
    actions.push({
      label: "Transmettre l'attestation de conformité",
      url: Routes.Achèvement.transmettreAttestationConformité(identifiantProjet),
    });
  }

  if (rôle.aLaPermission('achèvement.transmettreDate') && !achèvement.estAchevé) {
    actions.push({
      label: "Transmettre la date d'achèvement réel",
      url: Routes.Achèvement.transmettreDateAchèvement(identifiantProjet),
    });
  }

  return { value: achèvement, actions };
};
