import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { CandidatDétails } from './CandidatDétails';

type CandidatSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Candidat';
export const CandidatSection = ({ identifiantProjet }: CandidatSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async () => {
      const lauréat = await getLauréatInfos(identifiantProjet);

      return (
        <Section title={sectionTitle}>
          <CandidatDétails emailContact={lauréat.emailContact.email} />
        </Section>
      );
    }),
    sectionTitle,
  );
