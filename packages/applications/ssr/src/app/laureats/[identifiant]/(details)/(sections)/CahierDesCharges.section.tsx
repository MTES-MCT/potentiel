import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
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

      const cahierDesChargesModificatifDisponible =
        rôle.aLaPermission('cahierDesCharges.choisir') &&
        cahierDesCharges.période.cahiersDesChargesModifiésDisponibles.length;

      const doitChoisirUnCahierDesChargesModificatif =
        rôle.aLaPermission('cahierDesCharges.choisir') &&
        cahierDesCharges.doitChoisirUnCahierDesChargesModificatif();

      const value = {
        ...mapToPlainObject(cahierDesCharges),
        doitChoisirUnCahierDesChargesModificatif,
      };

      const action = cahierDesChargesModificatifDisponible
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
