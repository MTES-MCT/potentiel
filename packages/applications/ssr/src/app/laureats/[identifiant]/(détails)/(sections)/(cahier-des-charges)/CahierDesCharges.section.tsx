import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';

import { getCahierDesCharges } from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../(components)/Section';

import { CahierDesChargesDétails } from './CahierDesChargesDétails';

type CahierDesChargesSectionProps = {
  identifiantProjet: string;
};

export const CahierDesChargesSection = ({
  identifiantProjet: identifiantProjetValue,
}: CahierDesChargesSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const value = {
      ...mapToPlainObject(cahierDesCharges),
      doitChoisirUnCahierDesChargesModificatif:
        cahierDesCharges.doitChoisirUnCahierDesChargesModificatif(),
    };

    const action = rôle.aLaPermission('cahierDesCharges.choisir')
      ? {
          label: 'Accéder au choix du cahier des charges',

          url: Routes.CahierDesCharges.choisir(identifiantProjet.formatter()),
        }
      : undefined;

    return (
      <Section title="Cahier des charges">
        <CahierDesChargesDétails value={value} action={action} />
      </Section>
    );
  });
