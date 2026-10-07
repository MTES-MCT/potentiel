import Notification from '@codegouvfr/react-dsfr/picto/Notification';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { NouveautésDétails } from './Nouveautés.détails';

const sectionTitle = 'Nouveautés';

export const NouveautésSection = () =>
  SectionWithErrorHandling(
    async () => (
      <Section
        title={sectionTitle}
        picto={<Notification color="green-emeraude" fontSize="large" />}
        className="border-none"
      >
        <NouveautésDétails />
      </Section>
    ),
    sectionTitle,
  );
