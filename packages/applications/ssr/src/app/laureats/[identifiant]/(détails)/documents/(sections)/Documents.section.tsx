import { IdentifiantProjet } from '@potentiel-domain/projet';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { Section } from '@/components/atoms/menu/Section';

import { DocumentsDétails } from './DocumentsDétails';

type DocumentsSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Attestation';
export const DocumentsSection = ({ identifiantProjet }: DocumentsSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const lauréat = await getLauréatInfos(identifiantProjet);

      return (
        <Section title={sectionTitle}>
          <DocumentsDétails attestation={lauréat.attestationDésignation} />
        </Section>
      );
    }),
    sectionTitle,
  );
