import { mapToPlainObject } from '@potentiel-domain/core';
import { CahierDesCharges, type IdentifiantProjet } from '@potentiel-domain/projet';

import { getPériodeAppelOffres } from '@/app/_helpers';
import { CahierDesChargesDétails } from '@/app/laureats/[identifiant]/(détails)/(sections)/CahierDesChargesDétails';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

type CahierDesChargesSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Cahier des charges';

export const CahierDesChargesSection = ({ identifiantProjet }: CahierDesChargesSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async () => {
      const { appelOffres, famille, période } = await getPériodeAppelOffres(identifiantProjet);

      const cahierDesCharges = CahierDesCharges.bind({
        appelOffre: appelOffres,
        période,
        famille,
        technologie: undefined,
        cahierDesChargesModificatif: undefined,
      });

      const value = {
        ...mapToPlainObject(cahierDesCharges),
        doitChoisirUnCahierDesChargesModificatif: false,
      };

      return (
        <Section title={sectionTitle}>
          <CahierDesChargesDétails value={value} />
        </Section>
      );
    }),
    sectionTitle,
  );
