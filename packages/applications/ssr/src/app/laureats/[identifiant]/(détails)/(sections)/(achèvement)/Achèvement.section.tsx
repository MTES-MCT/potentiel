import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../(components)/Section';
import { getAchèvement } from '../../_helpers/getAchèvement';

import { AchèvementDétails } from './AchèvementDétails';

type AchèvementSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const AchèvementSection = ({
  identifiantProjet: identifiantProjetValue,
}: AchèvementSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const achèvement = await getAchèvementData(identifiantProjet.formatter(), rôle);

    return (
      <Section title="Achèvement" className={achèvement.value.estAchevé ? '' : 'print:hidden'}>
        <AchèvementDétails
          actions={achèvement.actions}
          value={mapToPlainObject(achèvement.value)}
        />
      </Section>
    );
  });

const getAchèvementData = async (
  identifiantProjet: IdentifiantProjet.RawType,
  rôle: Role.ValueType,
) => {
  const achèvement = await getAchèvement(identifiantProjet);

  const actions: { label: string; url: string; permission: Role.Policy }[] = [];

  if (achèvement.estAchevé) {
    actions.push({
      permission: 'achèvement.modifier',
      label: "Modifier les informations d'achèvement du projet",
      url: Routes.Achèvement.modifierAttestationConformité(identifiantProjet),
    });
  } else {
    actions.push({
      permission: 'achèvement.transmettreAttestation',
      label: "Transmettre l'attestation de conformité",
      url: Routes.Achèvement.transmettreAttestationConformité(identifiantProjet),
    });

    actions.push({
      permission: 'achèvement.transmettreDate',
      label: "Transmettre la date d'achèvement réel",
      url: Routes.Achèvement.transmettreDateAchèvement(identifiantProjet),
    });
  }

  return {
    value: achèvement,
    actions: actions.filter((action) => rôle.aLaPermission(action.permission)),
  };
};
