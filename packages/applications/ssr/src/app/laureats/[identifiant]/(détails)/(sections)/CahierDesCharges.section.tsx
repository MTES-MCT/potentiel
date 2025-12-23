import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';

import { getCahierDesCharges } from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../(components)/Section';
import { SectionWithErrorHandling } from '../../_helpers';

import { CahierDesChargesDétails } from './CahierDesChargesDétails';

type CahierDesChargesSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Cahier des charges';

export const CahierDesChargesSection = ({
  identifiantProjet: identifiantProjetValue,
}: CahierDesChargesSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

      const doitChoisirUnCahierDesChargesModificatif =
        rôle.aLaPermission('cahierDesCharges.choisir') &&
        cahierDesCharges.doitChoisirUnCahierDesChargesModificatif();

      const value = {
        ...mapToPlainObject(cahierDesCharges),
        doitChoisirUnCahierDesChargesModificatif,
      };

      const action = doitChoisirUnCahierDesChargesModificatif
        ? {
            label: 'Accéder au choix du cahier des charges',
            url: Routes.CahierDesCharges.choisir(identifiantProjet.formatter()),
          }
        : undefined;

      return (
        <Section title={sectionTitle}>
          <CahierDesChargesDétails value={value} action={action} />
        </Section>
      );
    }),
    sectionTitle,
  );
